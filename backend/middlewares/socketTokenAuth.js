//  MIDDLEWARE TO AUTHENTICATE THE USERS, WHO ARE CONNECTING TO SOCKETS, AND SAVING THERE ID, NAME IN THE REDIS

const jwt = require("jsonwebtoken");
require("dotenv").config();
const redis = require("../services/redis.js");

const UserModel = require("../models/UserModel.js");

async function socketTokenAuth(socket, next) {
  let token = socket.handshake?.auth?.token;

  let pos = await redis.lpos("blacklist_tokens", token);

  if (pos != null) {
    socket.playerName = "Guest";
    socket.userId = null;

    return next();
  }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    let user = await UserModel.findById({ _id: decoded.userId });
    if (user?.name) {
      socket.userId = decoded.userId;
      socket.playerName = await user.name;
    } else {
      socket.playerName = "Guest";
      socket.userId = null;
    }
    next();
  } catch (err) {
    socket.playerName = "Guest";
    socket.userId = null;
    next();
  }
}

module.exports = socketTokenAuth;
