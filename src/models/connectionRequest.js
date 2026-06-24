const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
}, {timestamps: true});

// compound index
connectionRequestSchema.index({fromUserId: 1, toUserId: 1});

// whenever we are writing a schema method or a pre function, try to avoid arrow function
// below this is a method which will be called every time a connectionRequest is saved
connectionRequestSchema.pre("save", function () {
    const connectionRequest = this;
    // Check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!!!");
    }
    // next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = {ConnectionRequest};