var jwt = require('jsonwebtoken');

const jwt_Secret = process.env.JWT_Secret;
const fetchuser =  (req,res,next) =>{
    // here the user's token(auth-token) is taken from database(we are manually putting into header NOW).
    
    const token = req.header('auth-token');
    if(!token){
       return  res.status(401).send({error:"Please authenticate valid token"});
    }
    // this try uses JWT to verify whether the token used has the json secret(jwt_secret);
    // & if present then fectches the user by ** user.id ** from database. which is sent to the ROUTE-3;
    // since it is post as ("/",****fetchuser****,(res,req){...})
    // if NOT then error-401 is Send.
    try{
        const data = jwt.verify(token,jwt_Secret);
        req.user = data.user;
        next();
    }
    catch(err){
        res.status(401).send({err:"Please authenticate valid token"});
    }
}
module.exports = fetchuser;