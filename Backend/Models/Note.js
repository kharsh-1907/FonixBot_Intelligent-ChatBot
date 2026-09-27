const mongoose = require('mongoose');
const { Schema } = mongoose;


const noteSchema = new Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },

    tittle :{ type:String,required:true,},
    description :{ type:String,required:true, },
    tag :{ type:String,default:"Working!" },
    Date :{type:Date,default:Date.now}
});

module.exports = mongoose.model('notes',noteSchema);