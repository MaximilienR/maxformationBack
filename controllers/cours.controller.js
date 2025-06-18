const Cours = require("../models/cours/cours.model"); // ✅ Chemin correct vers le modèle

// 🔹 Récupérer tous les cours
const getAllCours = async (req, res) => {
  try {
    const cours = await Cours.find();
    res.json(cours);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des cours" });
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
    res.status(500).json({ message: "Erreur lors de la récupération du cours." });
  }
};

// 🔹 Créer un cours
const createCours = async (req, res) => {
  try {
    console.log("Requête reçue, données:", req.body);

    const { name, description, video, image, niveau } = req.body;

    if (!name || !image || !niveau) {
      return res.status(400).json({ message: "Les champs name, image et niveau sont requis." });
    }

    const newCours = new Cours({
      name,
      description,
      video,
      image,
      niveau,
    });

    const savedCours = await newCours.save();
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
    const { name, description, video } = req.body;

    const updatedCours = await Cours.findByIdAndUpdate(
      id,
      { name, description, video },
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

// ✅ Exports unifiés
module.exports = {
  getAllCours,
  getCoursById,
  createCours,
  deleteCours,
  updateCours,
};
