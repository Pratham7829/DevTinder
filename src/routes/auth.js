const express = require("express");
const authRouter = express.Router();
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const {validateSignUpData} = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
    try{
    // validation of data
    validateSignUpData(req);
    const {firstName, lastName, emailId, password} = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // creating an new instance of the User model
    const user = new User({firstName, lastName, emailId, password : passwordHash});
    
    await user.save();
    res.send("user Added successfully");
    } catch(err) {
        // console.error("Error adding user:", err);
        res.status(400).send("Error saving the user: " + err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            // throw new Error("EmailID is not present in DB!!!");
            throw new Error("Invalid Credentials!!!");
        } else{
            // const isPasswordValid = await bcrypt.compare(password, user.password);
            const isPasswordValid = await user.validatePassword(password);

            if(isPasswordValid){
                // create a JWT token
                // const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790", {expiresIn: "1d"});
                const token = await user.getJWT();
                // console.log(token);

                // Add the token to cookie and send the response back to the user
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8 * 3600000)
                });

                res.send("LogIn Successfull!!!");
            } else{
                // throw new Error("Password is not correct");
                throw new Error("Invalid Credentials!!!");
            }
        }

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = {authRouter};