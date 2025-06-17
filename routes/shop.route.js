const { sendShopMail } = require("../controllers/shop.controller");
const router = require("express").Router();

router.post("/", sendShopMail);

module.exports = router;
