const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/FonixAi";

const connectToMongo = async () => {

    try {
        await mongoose.connect(mongoURI);
        console.log("connected Sucessfully!");
    }
    catch(err){
        console.log(err);
    }
}


module.exports = connectToMongo;