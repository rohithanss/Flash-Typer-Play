const Redis = require("ioredis");
require("dotenv").config();

// CONFIGURING REDIS

const redis = new Redis({
  port: 13222, // Redis port
  host: process.env.REDIS_URI, // Redis host
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: 0, // Defaults to 0
});

module.exports = redis;
