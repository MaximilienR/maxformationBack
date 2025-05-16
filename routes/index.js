const router = require("express").Router();

const apiUsers = require("./user.route");
const apiContact=require('./contact.route');
router.use("/contact", apiContact);


module.exports = router;

//localhost:3000/
