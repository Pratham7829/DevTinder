const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }

        const loggedInUser = req.user;
        
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        await loggedInUser.save();

        res.json({message: `${loggedInUser.firstName}, your Profile Updated Successfully!!!`, data: loggedInUser});

    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new Error("All fields are required.");
        }

        const loggedInUser = req.user;
        const isMatch = await bcrypt.compare(currentPassword, loggedInUser.password);
        if(!isMatch){
            throw new Error("Invalid Credentials");
        }

        const isSamePassword = await bcrypt.compare(newPassword, loggedInUser.password);

        if (isSamePassword) {
            throw new Error("New password cannot be the same as current password.");
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            throw new Error("New and Confirm passwords do not match!!!");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter a strong new password!!!");
        }

        loggedInUser.password = await bcrypt.hash(newPassword, 10);
        await loggedInUser.save();
        res.json({
            message: "Password Updated Successfully!!!"
        });
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = {profileRouter};