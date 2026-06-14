const express = require('express');
const app = express(); // Create an instance of the Express application
const {adminAuth} = require("./middlewares/auth");

app.use("/admin", adminAuth); // Apply the adminAuth middleware to all routes starting with /admin

app.get("/admin/getAllData", (req, res) => {
    res.send("Data sent!!!");
});

app.get("/admin/deleteData", (req, res) => {
    res.send("Data deleted!!!");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});