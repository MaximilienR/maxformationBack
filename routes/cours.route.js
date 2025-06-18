const router = require("express").Router();
const {
  getAllCours,
  createCours,
  deleteCours,
  updateCours,
  getCoursById, // ✅ On l'importe ici
} = require("../controllers/cours.controller");

// 🔹 Récupérer tous les cours
router.get("/", getAllCours);

// 🔹 Créer un cours
router.post("/", createCours);

// 🔹 Récupérer un cours par son ID ✅
router.get("/:id", getCoursById);

// 🔹 Supprimer un cours
router.delete("/:id", deleteCours);

// 🔹 Mettre à jour un cours
router.put("/:id", updateCours);

module.exports = router;