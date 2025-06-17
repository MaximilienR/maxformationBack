const router = require("express").Router();
const { createCours, deleteCours } = require("../controllers/cours.controller");

// 🔹 Créer un cours
router.post("/", createCours);
router.delete("/:id", deleteCours);

module.exports = router;
