const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("cloudinary");
const path = require("path");
const sendToken = require("../utilities/jwtToken");
const fs = require("fs");

async function createUser(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      const filename = req.file.filename;
      const filePath = `uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error deleting file" });
        } else {
          res.json({ message: "File deleted" });
        }
      });
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

    const newUser = await User.create(user);
    res.status(201).json({
      success: true,
      newUser,
    });
    console.log(user);
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
}
// async function createUser(req, res, next) {
//   try {
//     const { name, email, password } = req.body;
//     const userEmail = await User.findOne({ email });
//     if (userEmail) {
//       return next(new ErrorHandler("User already exists", 400));
//     }
//     let avatarUrl;
//     if (req.file) {
//       avatarUrl = req.file.path;
//     }

//     const user = {
//       name: name,
//       email: email,
//       password: password,
//       avatar: { url: avatarUrl },
//     };
//     const newUser = new User(user);
//     await newUser.save();
//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       user: newUser,
//     });
//     console.log(user);
//     console.log(avatarUrl);
//   } catch (error) {
//     next(error);
//   }
// }

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

async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User does not exist", 400));
    }
    res.status(200).json({
      sucess: true,
      user,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

async function logoutUser(req, res, next) {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
}

async function updateUserInfo(req, res, next) {
  try {
    const { email, password, phoneNumber, name } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }

    user.name = name;
    user.email = email;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function updateUserAvatar(req, res, next) {
  try {
    const existsUser = await User.findById(req.user.id);

    const existAvatarPath = `uploads/${existsUser.avatar}`;

    fs.unlinkSync(existAvatarPath);

    const fileUrl = path.join(req.file.filename);

    const user = await User.findByIdAndUpdate(req.user.id, { avatar: fileUrl });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function updateUserAddress(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    const sameAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameAddress) {
      return next(
        new ErrorHandler(`${req.body.addressType} address already exists`)
      );
    }
    const existsAddress = user.addresses.find(
      (address) => address._id === req.body._id
    );

    if (existsAddress) {
      Object.assign(existsAddress, req.body);
    } else {
      user.addresses.push(req.body);
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

module.exports = {
  createUser,
  loginUser,
  getUser,
  logoutUser,
  updateUserInfo,
  updateUserAvatar,
  updateUserAddress,
};
