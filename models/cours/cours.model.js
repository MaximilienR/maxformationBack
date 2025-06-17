const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    video: { type: String }, // URL ou chemin de la vidéo, optionnel
  },
  { timestamps: true }
);

const Cours = mongoose.model("Cours", coursSchema);

module.exports = Cours;
