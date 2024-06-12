const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("../Cloudinary/cloudinary.config");
const path = require("path");
const sendToken = require("../utilities/jwtToken");
const fs = require("fs");

async function createUser(req, res, next) {
  try {
    let { name, email, password, avatar } = req.body;
    let userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }
   
    if (req.file) {
      const myCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const user = {
      name,
      email,
      password,
      avatar,
    };

    const newUser = await User.create(user);
    res.status(201).json({
      success: true,
      message: "User created successfully",
      newUser,
    });
  } catch (err) {
    return next(err);
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

async function deleteUserAddress(req, res, next) {
  try {
    const userId = req.user._id;
    const addressId = req.params.id;

    await User.updateOne(
      {
        _id: userId,
      },
      { $pull: { addresses: { _id: addressId } } }
    );

    const user = await User.findById(userId);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}

async function updateUserPassword(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(
      req.body.oldPassword
    );

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect!", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("Password doesn't matched with each other!", 400)
      );
    }
    user.password = req.body.newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
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
  deleteUserAddress,
  updateUserPassword,
};
