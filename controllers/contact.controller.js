const { sendMessage, sendMessageToAdmin } = require("../email/email");

const sendMail = async (req, res) => {
  console.log(req.body);
  try {
    const { email, subject, message } = req.body;

    // 1. Envoie l'accusé de réception à l'utilisateur
    await sendMessage(email);

    // 2. Envoie le message complet à l'admin
    await sendMessageToAdmin(email, subject, message);

    console.log("Accusé de réception et message admin envoyés à : %s", email);
    res.status(200).json({
      success: true,
      message: "Emails envoyés avec succès !",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi des emails :", error);
    res.status(500).json({
      success: false,
      error: "Une erreur s'est produite lors de l'envoi des emails.",
    });
  }
};

module.exports = {
  sendMail,
  sendMessageToAdmin,
};
