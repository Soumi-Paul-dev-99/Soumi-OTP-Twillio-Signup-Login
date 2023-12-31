const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        default:null
    },
    last_name :{
        type:String,
        default : null
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    number:{
        type:Number,
    },
    message:{
        type:String,
    },
    token:{
        type:String
    },
    file: {
          type: String,
          required: true,
        },
      
});

module.exports = mongoose.model("user",userSchema);