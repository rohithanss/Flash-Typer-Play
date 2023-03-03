const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const { uid } = require("uid");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const redis = require("./services/redis.js");

const connection = require("./config/db.js");
const userRouter = require("./routers/user.Router");
const textRouter = require("./routers/text.Router");
const generateOtpRouter = require("./routers/generateOtp.Router");

const socketTokenAuth = require("./middlewares/socketTokenAuth.js");

const TextModel = require("./models/TextModel.js");
const UserModel = require("./models/UserModel.js");

const PORT = process.env.PORT || 7010;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send(
    `<h1 style="text-align:center; color:teal">Base endpoint for FLASH TYPER PLAY</h1>`
  );
});

app.use("/user", userRouter);
app.use("/text", textRouter);
app.use("/getotp", generateOtpRouter);

const io = new Server(server, { cors: { origin: "*" }, path: "/play" });
io.use(socketTokenAuth);
const roomDetails = { roomId: null, textId: null, members: 0, status: false };
let players = [];

io.on("connection", async (socket) => {
  let intervalId;
  let text;
  if (roomDetails.members == 0) {
    try {
      let roomId = uid(16);
      redis.set(roomId, 0);
      let response = await TextModel.aggregate().sample(1);
      text = await response[0];
      roomDetails.roomId = roomId;
      roomDetails.textId = text._id;
      roomDetails.members = 0;
      roomDetails.status = true;
    } catch (err) {
      roomDetails.status = false;
    }
  } else {
    text = await TextModel.findById({ _id: roomDetails.textId });
  }

  socket.join(roomDetails.roomId);
  roomDetails.members++;
  let player = {
    playerId: socket.id,
    name: socket.playerName,
    userId: socket.userId,
    speed: 0,
    playerRank: 0,
    playerPos: 0,
  };

  socket.emit("room-joined", roomDetails, text, [player, ...players]);
  socket.to(roomDetails.roomId).emit("newPlayer", player);
  players.push(player);

  if (roomDetails.members == 2) {
    let countDown = 10;
    intervalId = setInterval(() => {
      countDown--;
      io.to(roomDetails.roomId).emit("startingIn", countDown);
      if (countDown == 0) {
        io.to(roomDetails.roomId).emit("start", "start");
        roomDetails.members = 0;
        players = [];
        clearInterval(intervalId);
      }
    }, 1000);
  }

  socket.on(
    "updateStats",
    async (roomId, playerId, speed, playerPos, isCompleted) => {
      let playerRank;
      if (isCompleted) {
        let rank = await redis.get(roomId);
        playerRank = ++rank;
        redis.set(roomId, rank);
        if (socket.userId) {
          await UserModel.findByIdAndUpdate(
            { _id: socket.userId },
            { $inc: { totalRaces: 1 }, $max: { speed: speed } }
          );
        }
      } else {
        playerRank = 0;
      }
      io.to(roomId).emit("playerStats", {
        playerId,
        speed,
        playerPos,
        playerRank,
      });
    }
  );

  socket.on("disconnect", () => {
    if (roomDetails.members > 0) roomDetails.members--;
    if (roomDetails.members == 0) {
      players = [];
    }
    if (roomDetails.members < 2) {
      clearInterval(intervalId);
    }
  });
});

server.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.log("error while connecting to db");
  }
  console.log(`Listening at \nhttp://localhost:7070/`);
});
