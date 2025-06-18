const router = require("express").Router();
const {
  createCours,
  deleteCours,
  updateCours, // <- à importer
} = require("../controllers/cours.controller");

// 🔹 Créer un cours
router.post("/", createCours);

// 🔹 Supprimer un cours
router.delete("/:id", deleteCours);

// 🔹 🔧 Mettre à jour un cours
router.put("/:id", updateCours); // ✅ AJOUTE CETTE ROUTE

module.exports = router;