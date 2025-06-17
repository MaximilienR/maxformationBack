const { sendConfirmAchat } = require("../email/email");

const sendShopMail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: "Email requis" });
    }

    await sendConfirmAchat(email);

    res
      .status(200)
      .json({ success: true, message: "Email de confirmation envoyé" });
  } catch (error) {
    console.error("Erreur envoi mail:", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'envoi de l'email",
    });
  }
};

module.exports = { sendShopMail };
