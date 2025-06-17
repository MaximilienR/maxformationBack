const { sendMessage } = require("../email/email");

const sendMail = async (req, res) => {
  console.log(req.body);
  try {
    const { email } = req.body;
    await sendMessage(email);
    console.log("Accusé de réception envoyé à : %s, Message ID: %s", email);
    res
      .status(200)
      .json({
        success: true,
        message: "Accusé de réception envoyé avec succès !",
      });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'accusé de réception :", error);
    res
      .status(500)
      .json({
        success: false,
        error:
          "Une erreur s'est produite lors de l'envoi de l'accusé de réception.",
      });
  }
};

module.exports = {
  sendMail,
};
