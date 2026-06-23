const express = require('express');
const { connectDB } = require('./config/database');
const {User} = require('./models/user');
const app = express(); // Create an instance of the Express application
const {validateSignUpData} = require("./utils/validation"); // Import the validation function
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Request me aayi cookies ko req.cookies object me convert karta hai.

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try{
        const {emailId, password} = req.body;

        const user = await User.findOne({emailId: emailId});
        if(!user){
            // throw new Error("EmailID is not present in DB!!!");
            throw new Error("Invalid Credentials!!!");
        } else{
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(isPasswordValid){
                // create a JWT token
                const token = await jwt.sign({_id: user._id}, "DEV@Tinder$790");
                // console.log(token);

                // Add the token to cookie and send the response back to the user
                res.cookie("token", token);

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

app.get("/profile", async (req, res) => {
    try{
        const cookies = req.cookies;

        const {token} = cookies;
        if(!token){
            throw new Error("Invalid Token!!!");
        }
        // validate my token

        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // console.log(decodedMessage);
        const {_id} = decodedMessage;
        // console.log("logged in user is: " + _id);

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User does not exist!!!");
        }

        // console.log(cookies);
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

// find users by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try{
        const user = await User.findOne({emailId: userEmail});
        if(user) {
            res.send(user);
        } else {
            res.status(404).send("User not found");
        }
    } catch(err) {
        console.error("Error finding user:", err);
        res.status(400).send("Error finding the user" + err.message);
    }

});

// Feed API - get all the users from the database
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(err) {
        console.error("Error finding users:", err);
        res.status(400).send("Error finding the users" + err.message);
    }
});

// delete user by id
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        console.log(user);
        if(user) {
            res.send("User deleted successfully");
        } else {
            res.status(404).send("User not found");
        }
    } catch(err) {
        console.error("Error deleting user:", err);
        res.status(400).send("Error deleting the user" + err.message);
    }
});

// update data of user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try{

        const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "about", "skills"];

        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if(!isUpdateAllowed) {
            throw new Error("Invalid updates");
        }

        if(data.skills.length > 10) {
            throw new Error("You can add maximum 10 skills");
        }

        const user = await User.findByIdAndUpdate(userId, data, {returnDocument: "before", runValidators: true});
        // console.log(user);
        res.send("User updated success   fully");
    }catch(err) {
        console.error("Error updating user:", err);
        res.status(400).send("Error updating the user" + err.message);
    }
});


// we should do app.listen after we habe connected to the database
connectDB()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(3000, () => {
            console.log("Server is successfully listening on port 3000");
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });