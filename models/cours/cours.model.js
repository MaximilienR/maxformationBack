const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    explication: { type: String },
    video: { type: String },
    image: { type: String },
    niveau: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

const Cours = mongoose.model("Cours", coursSchema);

module.exports = Cours;
