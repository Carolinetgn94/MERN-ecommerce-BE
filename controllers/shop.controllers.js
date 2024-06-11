const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("cloudinary");
const path = require("path");
const fs = require("fs");
const Shop = require("../models/shop.models");
const sendShopToken = require("../utilities/shopToken");

async function createShop (req, res, next) {
    try {
        const {email} = req.body;
        const sellerEmail = await Shop.findOne({email});
        if (sellerEmail) {
            const filename = req.file.filename;
            const filePath = `uploads/${filename}`
            fs.unlink (filePath, (err) => {
              if(err) {
                console.log(err);
                res.status(500).json({message: "Error deleting file"})
              } else {
                res.json({message: "File deleted"})
              }
            })
              return next(new ErrorHandler("User already exists", 400));
          }
          const filename = req.file.filename;
        const fileUrl = path.join(filename);


        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: fileUrl,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            postalCode: req.body.postalCode,
        };

        const newSeller = await Shop.create(seller);
        res.status(201).json({
          success: true,
          newSeller,
        })
        console.log(seller);

    } catch (err) {
        return next (new ErrorHandler(err.message, 400));
    }
}

async function loginShop(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(
          new ErrorHandler("Please input correct email or password", 400)
        );
      }
      const user = await Shop.findOne({ email }).select("+password");
      if (!user) {
        return next(new ErrorHandler("User doesn't exist", 400));
      }
      const isPasswordValid = await user.comparePassword(password);
  
      if (!isPasswordValid) {
        return next(new ErrorHandler("Incorrect Password", 400));
      }
      sendShopToken(user, 201, res);
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }

  async function getShop (req, res, next) {
    try { 
      const seller = await Shop.findById(req.seller._id)
  
      if (!seller) {
        return next(new ErrorHandler("Seller does not exist", 400));
      }
      res.status(200).json({
        sucess: true,
        seller,
      });
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }

  async function logoutShop(req, res, next) {
    try {
      res.cookie("seller_token", null, {
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

  async function updateShopAvatar (req, res, next) {
    try {
      const existsUser = await Shop.findById(req.seller._id);

      const existAvatarPath = `uploads/${existsUser.avatar}`;
  
      fs.unlinkSync(existAvatarPath);
  
      const fileUrl = path.join(req.file.filename);
  
      const user = await Shop.findByIdAndUpdate(req.seller._id, { avatar: fileUrl });
  
      res.status(200).json({
        success: true,
        user,
      });

    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }


module.exports = {
    createShop,
    loginShop,
    getShop,
    logoutShop,
    updateShopAvatar,
}