const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis({
  port: 18596, // Redis port
  host: "redis-18596.c305.ap-south-1-1.ec2.cloud.redislabs.com", // Redis host
  username: "default", // needs Redis >= 6
  password: process.env.REDIS_PASSWORD,
  db: 0, // Defaults to 0
});

module.exports = redis;
