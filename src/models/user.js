const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter a valid email address");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    age : {
        type: Number,
        min: 18,

    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "other"].includes(value.toLowerCase())){
                throw new Error("Data is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/user-profile-flat-icon-account-website-button-vector-graphics-colorful-solid-pattern-white-background-eps-91687525.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Please enter a valid url");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user"
    },
    skills: {
        type: [String]
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = {User};