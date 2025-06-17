const router = require("express").Router();

const apiUser = require("./user.route");
const apiContact = require("./contact.route");
const apiShop = require("./shop.route");
const apiCours = require("./cours.route"); // Import des routes cours

router.use("/contact", apiContact);
router.use("/user", apiUser);
router.use("/shop", apiShop);
router.use("/cours", apiCours); // Ajout des routes cours

module.exports = router;
