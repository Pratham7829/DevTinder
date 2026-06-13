const express = require('express');
const app = express(); // Create an instance of the Express application

app.get("/user", (req, res) => {
    res.send({firstName: "pratham", lastName: "singla"});
});

app.post("/user", (req, res) => {
    res.send("Data has been posted to the server");
});

app.delete("/user", (req, res) => {
    res.send("Data has been deleted from the server");
});

app.use("/test", (req, res) => {
    res.send("Hello from the server");
});

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});