const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    pseudo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", schema);

module.exports = User;
