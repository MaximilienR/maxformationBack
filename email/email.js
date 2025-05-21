const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"GMAIL",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
})

const sendMessage = async (email,token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "accusé de reception",

    html: `<p>votre demande à bien était prise en compte...</p>`,

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

module.exports={
    sendMessage,sendConfirmationEmail
}