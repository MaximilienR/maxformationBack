const { authMiddleware } = require("../middleware/auth");
const {
  signup,
  login,
  verifyMail,
  deleteUser,
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/delete", authMiddleware, deleteUser); // ✅ méthode DELETE
router.get("/verify/:token", verifyMail);

module.exports = router;
