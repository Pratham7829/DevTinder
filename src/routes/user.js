const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {ConnectionRequest} = require("../models/connectionRequest");

// Get all the pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", ["firstName", "lastName", "age", "gender", "about", "photoUrl", "skills"]);

        res.json({
            message: "Data fetched successfully!!!",
            data: connectionRequests
        });
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

const USER_SAFE_DATA = "firstName lastName age about photoUrl skills gender";

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        });

        res.json({
            message: "Connections found successfully!!!",
            data
        });
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = {userRouter};