const mongoose = require("mongoose")
const {isEmail} = require("validator")

const {Schema} = mongoose

const profileSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        default: "admin"
    },
    lastName: {
        type: String,
        required: true,
        default: "admin"
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail, "Please provide an email"],
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [7, "minimum password length is 7"]
    },
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model("Profile", profileSchema)