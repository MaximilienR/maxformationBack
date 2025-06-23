const mongoose = require("mongoose"); // ← Manquait !

const QuizzSchema = new mongoose.Schema({
  coursId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cours",
    required: true,
  },
  question: { type: String, required: true },
  reponse: [{ type: String, required: true }],
  reponseCorrect: { type: Number, required: true },
});

const Quizz = mongoose.model("Quizz", QuizzSchema);

module.exports = Quizz;
