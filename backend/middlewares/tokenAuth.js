const jwt = require("jsonwebtoken");
require("dotenv").config();
const redis = require("../services/redis.js");

async function tokenAuth(req, res, next) {
  let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  let pos = await redis.lpos("blacklist_tokens", token);

  if (pos != null) {
    return res.status(401).send({ msg: "invalid request", status: "fail" });
  }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.body.userId = decoded.userId;
    req.body.userRole = decoded.userRole;
    next();
  } catch (err) {
    res.send({ msg: "invalid token", status: err.message });
  }
}

module.exports = tokenAuth;
