const bcrypt = require("bcrypt");
const TempUser = require("../models/user/tempUser");
const User = require("../models/user/User");
const jwt = require("jsonwebtoken");
const { sendConfirmationEmail } = require("../email/email");
const SECRET = process.env.SECRET_KEY;
const SECRET_KEY =
  "803b3a856858df2230787355fcd88efb28e2bb4fca2aef64d26f103bcc9a7871fc64cdc840fb0acb0362f69447d895d8a31733be465570ae5ba3f997438022f2";

const createTokenEmail = (email) => {
  return jwt.sign({ email }, SECRET_KEY, {
    expiresIn: "180s",
  });
};

 
// inscription temporaire
const signup = async (req, res) => {
    console.log("Requête d'inscription reçue:", req.body);
    try {
        const { email, username, password, tel } = req.body;

        // 1. Vérifier si un compte définitif existe déjà avec cet e-mail
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Un compte avec cet e-mail est déjà enregistré." });
        }

        // 2. Vérifier si une inscription temporaire est déjà en cours pour cet e-mail
        const existingTempUser = await TempUser.findOne({ email });
        if (existingTempUser) {
            return res.status(400).json({ message: "Une demande d'inscription est déjà en attente pour cet e-mail. Veuillez vérifier votre boîte mail." });
        }

        // 3. Hacher le mot de passe avant de le stocker (même temporairement)
        const hashedPassword = await bcrypt.hash(password, 10); // 10 est un bon coût de salage

        // 4. Créer le token de confirmation
        const token = createTokenEmail(email);

        // 5. Envoyer l'e-mail de confirmation
        await sendConfirmationEmail(email, token);

        // 6. Enregistrer l'utilisateur temporaire dans le modèle TempUser
        const tempUser = new TempUser({ // <-- UTILISEZ BIEN TempUser ICI !
            email,
            token,
            username, // <-- Ajoutez 'username'
            password: hashedPassword, // <-- Ajoutez le mot de passe HACHÉ
            tel, // <-- Ajoutez 'tel'
        });
        await tempUser.save(); // Cette sauvegarde devrait maintenant réussir

        res.status(201).json({
            messageOk: "Veuillez confirmer votre inscription en consultant votre boîte mail.",
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error); // Utilisez console.error pour les erreurs

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: `Validation échouée: ${messages.join(', ')}` });
        }
        if (error.code === 11000) { // Erreur de duplication (par exemple, si email unique)
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];
            return res.status(409).json({ message: `Ce ${field} (${value}) est déjà utilisé.` });
        }
        // Gérer les erreurs d'envoi d'e-mail (si sendConfirmationEmail renvoie une erreur)
        if (error.message && error.message.includes("Nodemailer error")) {
            return res.status(500).json({ message: "Inscription enregistrée, mais échec de l'envoi de l'e-mail de confirmation. Veuillez vérifier votre adresse ou contacter le support." });
        }

        res.status(500).json({ message: "Une erreur interne du serveur est survenue lors de l'inscription." });
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
    //donnee recuperer du front
    const { email, password, } = req.body;
    const user = await User.findOne({ email });
    //information incorrect
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Email et/ou mot de passe incorrect" });
    }

    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user.toObject();
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
      res.status(200).json(userWithoutPassword);
      console.log(
        "utilisateur connecte" + " " + "bonjour " + " " + user.username
      );
    } else {
      res.status(400).json({ msg: "Email et/ou mot de passe incorrect" });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { signup, login, verifyMail };
