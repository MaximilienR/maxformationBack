const mongoose = require("mongoose");
const Progression = require("../models/progress/progression.model");

async function createOrUpdateProgression(req, res) {
  const { coursId, etat } = req.body;
  const userId = req.user.id; // <-- ici la correction

  try {
    let progression = await Progression.findOne({ userId, coursId });

    if (!progression) {
      progression = new Progression({ userId, coursId, etat });
    } else {
      progression.etat = etat;
      if (etat === "terminé" && !progression.dateFin) {
        progression.dateFin = new Date();
      }
    }

    await progression.save();
    res.status(200).json(progression);
  } catch (err) {
    res.status(500).json({ message: "Erreur progression", error: err.message });
  }
}

async function getUserProgressions(req, res) {
  const userId = req.user.id;

  try {
    const progressions = await Progression.find({ userId })
      .populate("coursId") // ← ajoute ce populate ici
      .exec();

    res.status(200).json(progressions);
  } catch (err) {
    res.status(500).json({ message: "Erreur progression", error: err.message });
  }
}

module.exports = { 
  createOrUpdateProgression, 
  getUserProgressions
};
