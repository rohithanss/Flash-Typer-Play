const jwt = require("jsonwebtoken");
require("dotenv").config();

// FUNCTION TO GENERATE TOKEN AND REFRESH TOKEN FOR LOGGED IN USERS

function generateToken(res, userId, userRole) {
  let token = jwt.sign({ userId, userRole }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  let refreshToken = jwt.sign({ userId, userRole }, process.env.REFRESH_KEY, {
    expiresIn: "5h",
  });
  res.cookie("token", token, { maxAge: 1000 * 60 * 60 });
  res.cookie("refreshToken", refreshToken, { maxAge: 1000 * 60 * 300 });
  return { token, refreshToken };
}

module.exports = generateToken;
