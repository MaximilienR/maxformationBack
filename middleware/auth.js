const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY;

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: "Non autorisé" });

    const token = authHeader.split(" ")[1];
    console.log("Token reçu :", token);
    console.log("SECRET_KEY :", SECRET);

    const decoded = jwt.verify(token, SECRET);
    req.user = { id: decoded.sub };
    next();
  } catch (error) {
    console.error("Erreur dans authMiddleware:", error);
    return res.status(401).json({ msg: "Token invalide" });
  }
};

module.exports = { authMiddleware };