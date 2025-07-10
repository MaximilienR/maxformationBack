const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "GMAIL",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMessage = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "accusé de reception",

    html: `<p>votre demande à bien était prise en compte...</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendReset = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="http://localhost:5173/reset?token=${token}">Réinitialiser mon mot de passe</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendConfirmationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation d'inscription",
    html: `<p>Bienvenue sur notre site ! Cliquez sur le lien suivant pour continuer votre inscription : <a href="${process.env.FRONT}/login?token=${token}">Confirmer l'inscription</a></p>`, // Incluez le token dans l'URL
  };

  await transporter.sendMail(mailOptions);
};

const sendConfirmAchat = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirmation de commande",
    html: `<p>merci pour votre commande !</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendMessageToAdmin = async (userEmail, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // ton email admin
    to: process.env.EMAIL_ADMIN, // l'admin reçoit sur son propre mail
    subject: `Nouveau message de contact : ${subject}`,
    html: `
      <h2>Nouvelle demande de contact</h2>
      <p><strong>De :</strong> ${userEmail}</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Message :</strong><br/>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendMessage,
  sendConfirmationEmail,
  sendConfirmAchat,
  sendReset,
  sendMessageToAdmin,
};
