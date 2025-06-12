const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  pseudo: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: false, unique: true },
  password: { type: String, required },
});
