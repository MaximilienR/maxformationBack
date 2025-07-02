const router = require("express").Router();

const apiUser = require("./user.route");
const apiContact = require("./contact.route");
const apiShop = require("./shop.route");
const apiCours = require("./cours.route"); // Import des routes cours
const apiCertificat = require("./certificat.route");
const progression = require("./progression.route")

router.use("/contact", apiContact);
router.use("/user", apiUser);
router.use("/shop", apiShop);
router.use("/cours", apiCours); // Ajout des routes cours
router.use("/certificat", apiCertificat);
router.use("/progression", progression)
module.exports = router;
