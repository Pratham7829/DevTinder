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
app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try{
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