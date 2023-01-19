const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connection = require("./config/db.js");
const userRouter = require("./routers/user.Router");
const textRouter = require("./routers/text.Router");
const generateOtpRouter = require("./routers/generateOtp.Router");

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

app.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (err) {
    console.log("error while connecting to db");
  }
  console.log(`Listening at \nhttp://localhost:7070/`);
});
