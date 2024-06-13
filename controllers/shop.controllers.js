const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("../Cloudinary/cloudinary.config");
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
          const file = req.file;
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'shop-avatars',
          });
          const avatarUrl = result.secure_url;

        const seller = {
            name: req.body.name,
            email: email,
            password: req.body.password,
            avatar: avatarUrl,
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
      if (!req.file) {
        return next(new ErrorHandler("No file uploaded", 400));
      }
  
      const file = req.file;
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'shop-avatars',
      });
      const avatarUrl = result.secure_url;
  
      const seller = await Shop.findByIdAndUpdate(req.seller._id, { avatar: avatarUrl }, { new: true });
  
      if (!seller) {
        return next(new ErrorHandler("Seller not found", 404));
      }
  
      res.status(200).json({
        success: true,
        message: "Avatar updated successfully",
        avatarUrl,
      });
  

    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  }


  async function updateSellerInfo (req, res, next) {
    try {
      const { name, description , address, phoneNumber, postalCode} = req.body;

      const shop = await Shop.findOne(req.seller._id);
  
      if (!shop) {
        return next(new ErrorHandler("User not found", 400));
      }
  
      shop.name = name;
      shop.description = description;
      shop.address = address;
      shop.phoneNumber = phoneNumber;
      shop.postalCode = postalCode;
  
      await shop.save();
  
      res.status(201).json({
        success: true,
        shop,
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
    updateSellerInfo,
}