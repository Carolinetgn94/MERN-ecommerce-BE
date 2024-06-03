const ErrorHandler = require("../utilities/ErrorHandler");
const cloudinary = require("cloudinary");
const path = require("path");
const sendToken = require("../utilities/jwtToken");
const fs = require("fs");
const Shop = require("../models/shop.models")

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


module.exports = {
    createShop,

}