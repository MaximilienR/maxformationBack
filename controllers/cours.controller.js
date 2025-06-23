const Cours = require("../models/cours/cours.model"); // ✅ Chemin correct vers le modèle
const Quiz = require("../models/quizz/Quizz"); // 🔹 N'oublie pas d'importer ton modèle Quiz

// 🔹 Récupérer tous les cours
const getAllCours = async (req, res) => {
  try {
    const cours = await Cours.find();
    res.json(cours);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des cours" });
  }
};

// 🔹 Récupérer un cours par ID
const getCoursById = async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) {
      return res.status(404).json({ message: "Cours introuvable." });
    }
    res.status(200).json(cours);
  } catch (error) {
    console.error("Erreur lors de la récupération du cours :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du cours." });
  }
};

// 🔹 Créer un cours (et son quiz s'il est fourni)
const createCours = async (req, res) => {
  try {
    console.log("Requête reçue, données:", req.body);

    const { name, description, explication, video, image, niveau, quiz } =
      req.body;

    if (!name || !image || !niveau) {
      return res
        .status(400)
        .json({ message: "Les champs name, image et niveau sont requis." });
    }

    const newCours = new Cours({
      name,
      description,
      explication,
      video,
      image,
      niveau,
    });

    const savedCours = await newCours.save();

    // 👇 Création du quiz si fourni
    if (quiz && quiz.question && quiz.answers?.length === 4) {
      const newQuiz = new Quiz({
        coursId: savedCours._id,
        question: quiz.question,
        reponse: quiz.answers,
        reponseCorrect: quiz.correctAnswerIndex,
      });

      await newQuiz.save();
    }

    res.status(201).json(savedCours);
  } catch (err) {
    console.error("Erreur lors de la création du cours :", err);
    res.status(500).json({
      message: "Erreur lors de la création du cours",
      error: err.message,
    });
  }
};

// 🔹 Supprimer un cours
const deleteCours = async (req, res) => {
  try {
    const deleted = await Cours.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }
    res.json({ message: "Cours supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};

// 🔹 Mettre à jour un cours
const updateCours = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, explication, video, image, niveau } = req.body;

    const updatedCours = await Cours.findByIdAndUpdate(
      id,
      { name, description, explication, video, image, niveau },
      { new: true }
    );

    if (!updatedCours) {
      return res.status(404).json({ message: "Cours non trouvé" });
    }

    res.status(200).json(updatedCours);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du cours :", error);
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du cours",
      error: error.message,
    });
  }
};

// 🔹 Créer un quiz séparément (si tu veux une route /quizz indépendante)
const createQuizz = async (req, res) => {
  try {
    const { coursId, question, reponse, reponseCorrect } = req.body;

    if (
      !coursId ||
      !question ||
      !reponse ||
      reponse.length !== 4 ||
      reponseCorrect == null
    ) {
      return res.status(400).json({
        message:
          "Les champs coursId, question, reponse (4 réponses) et reponseCorrect sont requis.",
      });
    }

    const newQuiz = new Quiz({
      coursId,
      question,
      reponse,
      reponseCorrect,
    });

    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error("Erreur lors de la création du quiz :", err);
    res.status(500).json({
      message: "Erreur lors de la création du quiz",
      error: err.message,
    });
  }
};

// ✅ Exports
module.exports = {
  getAllCours,
  getCoursById,
  createCours,
  deleteCours,
  updateCours,
  createQuizz,
};
