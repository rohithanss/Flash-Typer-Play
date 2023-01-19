const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    totalRaces: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    role: { type: String, enum: ["user"], default: "user" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
