const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  pseudo: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required },
  failedLoginAttempts: {
  type: Number,
  default: 0
},
lockUntil: {
  type: Date,
  default: null
}
});
