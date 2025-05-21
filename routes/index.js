const router = require("express").Router();

const apiUser=require('./user.route');
const apiContact=require('./contact.route');

router.use("/contact", apiContact);
router.use("/user", apiUser);


module.exports = router;

//localhost:3000/
