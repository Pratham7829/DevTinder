const express = require('express');
const app = express(); // Create an instance of the Express application

app.use("/", (req, res) => {
    res.send("Hello from the dashboard");
});

app.use("/hello", (req, res) => {
    res.send("hello hello hello");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});