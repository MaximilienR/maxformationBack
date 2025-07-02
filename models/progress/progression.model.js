const mongoose = require("mongoose");

const progressionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coursId: { type: mongoose.Schema.Types.ObjectId, ref: "Cours", required: true },
  dateDebut: { type: Date, default: Date.now },
  dateFin: { type: Date },
  etat: {
    type: String,
    enum: ["en cours", "terminé"],
    default: "en cours",
  },
});

module.exports = mongoose.model("Progression", progressionSchema);