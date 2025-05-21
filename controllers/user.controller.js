 
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

 
//inscription temporaire
const signup = async (req, res) => {
  console.log(req.body);
  try {
    //donnee recuperer du front
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Déjà inscrit" });
    }
    const token = createTokenEmail(email);
    await sendConfirmationEmail(email, token);
    const tempUser = new TempUser({
      email,
      token,
    });
    await tempUser.save();
    res.status(201).json({
      messageOk:
        "Veulliez confirmer votre en inscription en consultant votre boite mail",
    });
  } catch (error) {
    console.log(error);
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
    const { email, password } = req.body;
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
