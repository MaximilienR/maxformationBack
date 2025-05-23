const mongoose = require("mongoose")

const schema = new mongoose.Schema(
    {
        pseudo:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        mobile:{type:String,required:true,unique:true},
        password: {type:String,required}
    }
)