const router = require("express").Router();
const {
  getAllCours,
  createCours,
  deleteCours,
  updateCours, // <- à importer
} = require("../controllers/cours.controller");

// GET tous les cours
router.get("/", getAllCours);
// 🔹 Créer un cours
router.post("/", createCours);

// 🔹 Supprimer un cours
router.delete("/:id", deleteCours);

// 🔹 🔧 Mettre à jour un cours
router.put("/:id", updateCours); // ✅ AJOUTE CETTE ROUTE

module.exports = router;