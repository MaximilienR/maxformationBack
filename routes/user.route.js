const { authMiddleware } = require("../middleware/auth");
const { signup, login, verifyMail, deleteUser } = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/delete", authMiddleware, deleteUser);
router.get("/verify/:token", verifyMail);
module.exports = router;

//localhost:3000/user
