const express = require('express');
const app = express(); // Create an instance of the Express application

app.use("/user", [(req, res, next) => {
    console.log("First route handler");
    next();
    // res.send("Hello from the first route handler!");
}, (req, res, next) => {
    console.log("Second route handler");
    // res.send("Hello from the /user route!");
    next();
}], (req, res, next) => {
    console.log("Third route handler");
    res.send("Hello from the third route handler!");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});