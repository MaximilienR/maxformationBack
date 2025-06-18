const Cours = require("../models/cours/cours.model"); // <-- Import du modèle

// 🔹 Créer un cours.
const createCours = async (req, res) => {
  try {
    console.log("Requête reçue, données:", req.body); // Pour debug
    const { name, description, video } = req.body;

    const newCours = new Cours({
      name,
      description,
      video, // facultatif
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

 const updateCours = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, video } = req.body;

    const updatedCours = await Cours.findByIdAndUpdate(
      id,
      { name, description, video },
      { new: true } // <- retourne le cours mis à jour
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

module.exports = {
  createCours,
  // exporte aussi les autres fonctions ici, ex:
  // getAllCours,
  updateCours,
  deleteCours,
};
