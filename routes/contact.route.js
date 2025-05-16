const {
    sendMail 
}=require("../controllers/contact.controller");

const router = require("express").Router();

router.post("/",sendMail);

module.exports = router;
//localhost:3000/contact