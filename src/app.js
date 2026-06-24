const express = require('express');
const { connectDB } = require('./config/database');
const {User} = require('./models/user');
const app = express(); // Create an instance of the Express application
const {validateSignUpData} = require("./utils/validation"); // Import the validation function
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");
const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Request me aayi cookies ko req.cookies object me convert karta hai.

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

// we should do app.listen after we have connected to the database
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