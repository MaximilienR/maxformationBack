const bcrypt = require("bcrypt");
const TempUser = require("../models/user/tempUser");
const User = require("../models/user/User");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail, sendReset } = require("../email/email");

const SECRET = process.env.SECRET_KEY;
const SECRET_KEY =
  "803b3a856858df2230787355fcd88efb28e2bb4fca2aef64d26f103bcc9a7871fc64cdc840fb0acb0362f69447d895d8a31733be465570ae5ba3f997438022f2";

const createResetToken = (email) => {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: "15m" });
};

const createTokenEmail = (email) => {
  return jwt.sign({ email }, SECRET_KEY, {
    expiresIn: "180s",
  });
};

// inscription temporaire
const signup = async (req, res) => {
  console.log("Requête d'inscription reçue:", req.body);
  try {
    const { email, pseudo, password } = req.body;

    // 1. Vérifier si un compte définitif existe déjà avec cet e-mail
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Un compte avec cet e-mail est déjà enregistré." });
    }

    // 2. Vérifier si une inscription temporaire est déjà en cours pour cet e-mail
    const existingTempUser = await TempUser.findOne({ email });
    if (existingTempUser) {
      return res.status(400).json({
        message:
          "Une demande d'inscription est déjà en attente pour cet e-mail. Veuillez vérifier votre boîte mail.",
      });
    }

    // 3. Hacher le mot de passe avant de le stocker (même temporairement)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 est un bon coût de salage
    console.log("le mot de passe est " + hashedPassword);
    // 4. Créer le token de confirmation
    const token = createTokenEmail(email);

    // 5. Envoyer l'e-mail de confirmation
    await sendConfirmationEmail(email, token);

    // 6.. Enregistrer l'utilisateur temporaire dans le modèle TempUser
    const tempUser = new TempUser({
      // <-- UTILISEZ BIEN TempUser ICI !
      email,
      token,
      pseudo, // <-- Ajoutez 'username'
      password: hashedPassword, // <-- Ajoutez le mot de passe HACHÉ
    });
    await tempUser.save(); // Cette sauvegarde devrait maintenant réussir

    res.status(201).json({
      messageOk:
        "Veuillez confirmer votre inscription en consultant votre boîte mail.",
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error); // Utilisez console.error pour les erreurs

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res
        .status(400)
        .json({ message: `Validation échouée: ${messages.join(", ")}` });
    }
    if (error.code === 11000) {
      // Erreur de duplication (par exemple, si email unique)
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      return res
        .status(409)
        .json({ message: `Ce ${field} (${value}) est déjà utilisé.` });
    }
    // Gérer les erreurs d'envoi d'e-mail (si sendConfirmationEmail renvoie une erreur)
    if (error.message && error.message.includes("Nodemailer error")) {
      return res.status(500).json({
        message:
          "Inscription enregistrée, mais échec de l'envoi de l'e-mail de confirmation. Veuillez vérifier votre adresse ou contacter le support.",
      });
    }

    res.status(500).json({
      message:
        "Une erreur interne du serveur est survenue lors de l'inscription.",
    });
  }
};

//confirmer inscripition
const verifyMail = async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jsonwebtoken.verify(token, process.env.SECRET_KEY);
    const tempUser = await TempUser.findOne({ email: decoded.email, token });
    if (!tempUser) {
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
    const newUser = new User({
      pseudo: tempUser.pseudo,
      email: tempUser.email,
      password: tempUser.password,
    });
    await newUser.save();
    await TempUser.deleteOne({ email: tempUser.email });
    await sendValidationAccount(tempUser.email);
    res.redirect(`${process.env.CLIENT_URL}/login?message=success`);
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      const tempUser = await TempUser.findOne({ token });
      if (tempUser) {
        await tempUser.deleteOne({ token });
        await sendInvalidEmailToken(tempUser.email);
      }
      return res.redirect(`${process.env.CLIENT_URL}/register?message=error`);
    }
    console.log(error);
  }
};

//connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Tentative de connexion:", email);

    let user =
      (await User.findOne({ email })) || (await TempUser.findOne({ email }));
    const isTemp = user instanceof TempUser;

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Email et/ou mot de passe incorrect" });
    }

    // Vérifier le blocage
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingMs = user.lockUntil - Date.now();
      return res.status(403).json({
        msg: "Compte bloqué temporairement.",
        lockedUntil: user.lockUntil,
        remainingTime: remainingMs, // utile pour un compte à rebours
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Incrémenter les tentatives échouées
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      // Bloquer après 3 tentatives
      if (user.failedLoginAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
        user.failedLoginAttempts = 0; // reset
      }

      await user.save();
      return res
        .status(400)
        .json({ msg: "Email et/ou mot de passe incorrect" });
    }

    // Si match, reset les tentatives
    user.failedLoginAttempts = 0;
    user.lockUntil = null;

    if (isTemp) {
      const permanentUser = new User({
        pseudo: user.pseudo,
        email: user.email,
        password: user.password,
      });
      await permanentUser.save();
      await TempUser.deleteOne({ email: user.email });
      user = permanentUser;
    } else {
      await user.save();
    }

    const { password: pwd, ...userWithoutPassword } = user.toObject();
    const token = jwt.sign({}, SECRET, {
      expiresIn: "24h",
      subject: user._id.toString(),
      algorithm: "HS256",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ user: userWithoutPassword, token });

    console.log("Utilisateur connecté: bonjour", user.email);
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ msg: "Erreur serveur lors de la connexion." });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // Assure-toi que ton middleware met bien l'ID ici
    const { pseudo, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { pseudo, email },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Erreur updateUser:", error);
    res.status(500).json({ success: false, msg: "Erreur serveur" });
  }
};

//delete user

async function deleteUser(req, res) {
  console.log("Requête deleteUser reçue, user:", req.user);
  try {
    // Exemple suppression utilisateur MongoDB
    await User.findByIdAndDelete(req.user.id);
    return res.json({ msg: "Compte supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteUser:", err);
    return res
      .status(500)
      .json({ msg: "Erreur serveur lors de la suppression" });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email non trouvé" });
    }

    const token = createResetToken(email);
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await sendReset(email, token);

    res.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Données manquantes" });
    }

    // Vérifier token (exemple JWT)
    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Token invalide ou expiré" });
    }

    // Récupérer utilisateur par ID issu du token
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour mot de passe
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Mot de passe réinitialisé" });
  } catch (error) {
    console.error("Erreur resetPassword:", error);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
}
module.exports = {
  signup,
  login,
  verifyMail,
  deleteUser,
  updateUser,
  forgotPassword,
  resetPassword,
};
