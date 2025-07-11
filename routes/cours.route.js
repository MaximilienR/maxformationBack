const router = require("express").Router();
const {
  getAllCours,
  createCours,
  deleteCours,
  updateCours,
  getCoursById,
  createQuizz,
  getQuizzByCoursId,
  updateQuizz,
} = require("../controllers/cours.controller");

// Routes Cours
router.get("/", getAllCours);
router.get("/:id", getCoursById);
router.post("/", createCours);
router.put("/:id", updateCours);
router.delete("/:id", deleteCours);

// Routes Quizz
router.post("/quizz", createQuizz);
router.get("/quizz/cours/:coursId", getQuizzByCoursId);
router.put("/quiz/:id", updateQuizz);

module.exports = router;
