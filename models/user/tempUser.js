const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    pseudo: String,
    email: { type: String, required: true, unique: true },
    token: String,
    password: String, // vérifie bien ce nom
  },
  {
    timestamps: true,
  }
);
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 120 });

const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
