const Certificat = require("../models/certificat/certificat.model");

const createCertificats = async (req, res) => {
  try {
    console.log("Requête reçue, données:", req.body);

    const { name, date } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Les champs name, image et niveau sont requis." });
    }

    const newCertificat = new Certificat({
      name,
      date: date || new Date(),
    });

    const savedCertificat = await newCertificat.save();
    res.status(201).json(savedCertificat);
  } catch (err) {
    console.error("Erreur lors de la création du cours :", err);
    res.status(500).json({
      message: "Erreur lors de la création du cours",
      error: err.message,
    });
  }
};

const getAllCertificats = async (req, res) => {
  try {
    const certificat = await Certificat.find();
    res.json(certificat);
  } catch (error) {
    console.error("Erreur lors de la récupération des certificat :", error);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération des cours" });
  }
};

module.exports = {
  getAllCertificats,
  createCertificats,
};
