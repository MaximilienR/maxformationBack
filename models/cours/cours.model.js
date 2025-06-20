const mongoose = require("mongoose");

const coursSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    explication: { type: String }, // ✅ Champ ajouté
    video: { type: String }, // URL ou chemin de la vidéo, optionnel
    image: { type: String }, // URL ou chemin de l’image d’illustration
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
