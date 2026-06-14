const express = require('express');
const { connectDB } = require('./config/database');
const {User} = require('./models/user');
const app = express(); // Create an instance of the Express application

app.use(express.json()); // Middleware to parse JSON request bodies

app.post("/signup", async (req, res) => {

    // console.log(req.body);

    // creating an new instance of the User model
    const user = new User(req.body);
    try{
        await user.save();
        res.send("user Added successfully");
    } catch(err) {
        console.error("Error adding user:", err);
        res.status(400).send("Error saving the user" + err.message);
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