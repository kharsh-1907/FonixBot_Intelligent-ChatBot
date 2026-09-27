const express = require('express');
const router = express.Router();
// const user = require("../Models/User");
const User = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const jwt_Secret = process.env.JWT_Secret;
/**.................................................................................................... */
// Route 1: user created by "/api/auth/createUser"
router.post('/createUser', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('name', 'Enter a valid Name').isLength({ min: 2 }),
    body('password', 'PAssword should atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // console.log(req.body);
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        // console.log(user);
        if (user) {
            success = false
            return res.status(400).json({ success,error: "User already exists with this E-mail" });
        }
        //TO make password " hash " **BCrypt** is used (imported!! from json).
        const salt = await bcrypt.genSaltSync(5);
        const SecPassword = await bcrypt.hash(req.body.password, salt);
        //user into mongod Database ,whereas password goes as hash.
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: SecPassword,
        })
        //to make every user unique ID is taken from database.
        const data = {
            user: { id: user.id, }
        };
        // **JWT(Json Web Token from npm): which creates a new token(id) through 3 diffn parameters from database.
        // **jwt.sign()** it is sync function it takes id & included jwt_secret.
        const authtoken = jwt.sign(data, jwt_Secret);
        success = true;
        res.json({success,authtoken});
    }
    //if there's error in the auth/index/localhost/user,etc...it will be shown. 
    catch (err) {
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }
    /**there is no need for .then since at strating the error in database (if) is shown before syncing since it is async functioned!!!! .*/
    // .then(user => res.json(user))
    // .catch(err => {res.json({error:'please enter vaild E-mail',msg:err.message})})
})
/**.................................................................................................... */
//Route 2: user login creation by "/api/auth/login".
// same process as previous used post,database error(if so).
router.post('/login', [
    body('email', 'Enter a valid E-mail').isEmail(),
    body('password', 'Enter a Password').exists(),
], async (req, res) => {
    // console.log(req.body);
    let success = false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({success, error: "please login with correct cedentrials." });
        };
        let compare_password = await bcrypt.compare(password, user.password);
        if (!compare_password) {
            success = false
            return res.status(400).json({success, error: "please login with correct cedentrials." });
        };
        const data = {
            user: { id: user.id }
        }
        const authtoken = jwt.sign(data,jwt_Secret);
        success = true
        res.json({success,authtoken});
    }
    catch (err) {
        console.log(err);
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }
})
/**.................................................................................................... */
//Route 3: user logged in details  "/api/auth/getuser".

router.post('/getuser',fetchuser, async (req, res) => {
    // console.log(req.body);
    // as mention in fetchuser the user.id gets the user from database & send to json by **res.send(user)**
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let userID = req.user.id;
    try {
        const user = await User.findById(userID).select('-password');
        res.send(user);
    }
    catch (err) {
        console.log(err);
        console.error(err.message);
        res.status(500).send("Some Server Error Occured");
    }
})
module.exports = router;