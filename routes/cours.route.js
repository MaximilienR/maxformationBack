const router = require("express").Router();
const {
  getAllCours,
  createCours,
  deleteCours,
  updateCours,
  getCoursById,
  createQuizz,
  getQuizzByCoursId,
} = require("../controllers/cours.controller");

// Routes Cours
router.get("/", getAllCours);
router.post("/", createCours);
router.get("/:id", getCoursById);
router.delete("/:id", deleteCours);
router.put("/:id", updateCours);

// Routes Quizz
router.post("/quizz", createQuizz);
router.get("/quizz/cours/:coursId", getQuizzByCoursId);

module.exports = router;
