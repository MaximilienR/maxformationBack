// routes/progression.routes.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth");
const progressionCtrl = require("../controllers/progression.controller")

router.post("/", authMiddleware, progressionCtrl.createOrUpdateProgression);
router.get("/", authMiddleware, progressionCtrl.getUserProgressions);

module.exports = router;
