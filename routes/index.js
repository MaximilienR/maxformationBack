const router = require("express").Router();

const apiUser = require("./user.route");
const apiContact = require("./contact.route");
const apiShop = require("./shop.route");

router.use("/contact", apiContact);
router.use("/user", apiUser);
router.use("/shop", apiShop);

module.exports = router;
