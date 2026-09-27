const mongoose = require("mongoose");
const {Schema} = mongoose;

const Chatschema = new Schema({
     
    user:{ 
        type : mongoose.Schema.Types.ObjectId,
        ref :"user"
    },
    title : { type:String,required:true,default: "New Chat"},
    date : {type:Date,default:Date.now}
})

module.exports =  mongoose.models.chats || mongoose.model("chats",Chatschema) 