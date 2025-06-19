const router = require("express").Router();

const {
  getAllCertificats,
  createCertificats,
} = require("../controllers/certificat.controller");

// Récupérer tous les certificats
router.get("/", getAllCertificats);
router.post("/", createCertificats);
module.exports = router;
