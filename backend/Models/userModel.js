const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type :String ,
        required : true,
        unique : true
    },

    email:{
        type :String,
        required : true,
        unique : true
    },
    
    password :{
        type :String,
        require : true
    },

    profilePic:{
        type:String,
        default :null
    },
    
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]

}, {timestamps:true});


module.exports = mongoose.model("User", userSchema);