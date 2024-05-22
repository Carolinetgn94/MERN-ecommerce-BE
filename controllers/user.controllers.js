const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require ("cloudinary");
const path = require ("path");

async function createUser (req, res, next) {
    try {
        const { name, email, password} = req.body;
        const userEmail = await User.findOne({email});
        if (userEmail) {
            return next(new ErrorHandler("User already exists", 400));
        }
        const filename = req.file.filename;
        const fileUrl = path.join(filename);
        const user = {
            name: name,
            email: email,
            password: password,
            avatar: fileUrl,
        };
        console.log(user);
    } catch (err) {
        return next (new ErrorHandler(err.message, 400));
    }

} 

module.exports = {
    createUser,
}