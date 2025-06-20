const { authMiddleware } = require("../middleware/auth");
const {
  signup,
  login,
  verifyMail,
  deleteUser,
  updateUser,
  forgotPassword, // corrigé l'orthographe ici
} = require("../controllers/user.controller");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/update", authMiddleware, updateUser);

router.delete("/delete", authMiddleware, deleteUser); // ✅ méthode DELETE
router.get("/verify/:token", verifyMail);

router.post("/forgot", forgotPassword);

module.exports = router;
