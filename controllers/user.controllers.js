const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("cloudinary");
const path = require("path");
const sendToken = require("../utilities/jwtToken");

// async function createUser (req, res, next) {
//     try {
//         const { name, email, password} = req.body;
//         const userEmail = await User.findOne({email});
//         if (userEmail) {
//             return next(new ErrorHandler("User already exists", 400));
//         }
//         const fileUrl = req.file;
//         const user = {
//             name: name,
//             email: email,
//             password: password,
//             avatar: fileUrl,
//         };
//         console.log(user);
//     } catch (err) {
//         return next (new ErrorHandler(err.message, 400));
//     }

// }
async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
    let avatarUrl;
    if (req.file) {
      avatarUrl = req.file.path;
    }

    const user = {
      name: name,
      email: email,
      password: password,
      avatar: { url: avatarUrl },
    };
    const newUser = new User(user);
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
    console.log(user);
    console.log(avatarUrl);
  } catch (error) {
    next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorHandler("Please input correct email or password", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("User doesn't exist", 400));
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(new ErrorHandler("Incorrect Password", 400));
    }
    sendToken(user, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

module.exports = {
  createUser,
  loginUser,
};
