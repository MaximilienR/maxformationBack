const { signup, login, verifyMail } = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify/:token", verifyMail);
module.exports = router;

//localhost:3000/user
