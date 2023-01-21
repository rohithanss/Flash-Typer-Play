const { uid } = require("uid");
const redis = require("../services/redis.js");
const TextModel = require("../models/TextModel.js");

const roomDetails = { roomId: null, textId: null, members: 0, status: false };
let players = [];

async function raceSocket(socket) {
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
      console.log(err);
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
}

module.exports = raceSocket;
