const router = require("express").Router();
const { createCours } = require("../controllers/cours.controller");

// 🔹 Créer un cours
router.post("/", createCours);

module.exports = router;
