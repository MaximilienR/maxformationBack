const router = require("express").Router();

const apiUser = require("./user.route");
const apiContact = require("./contact.route");
const apiShop = require("./shop.route"); // <-- import de ta route shop

router.use("/contact", apiContact);
router.use("/user", apiUser);
router.use("/shop", apiShop); // <-- montage de la route shop

module.exports = router;
