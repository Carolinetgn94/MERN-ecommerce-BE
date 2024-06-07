const Product = require("../models/product.models");
const Shop = require("../models/shop.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const fs = require ("fs");

async function createProduct(req, res, next) {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.filename}`);
      const productData = req.body;
      productData.images = imageUrls;
      productData.shop = shop;

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
}


async function getAllShopProducts(req, res, next) {
    try {
        const products = await Product.find({shopId: req.params.id});

        res.status(201).json({
            success: true,
            products,
        })

    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
      }
}


async function deleteShopProduct(req, res, next) {
    try {
        const productId = req.params.id;
        
        const productData = await Product.findById(productId);

        productData.images.forEach((imageUrl) => {
            const filename = imageUrl;
            const filePath = `uploads/${filename}`;

            fs.unlink(filePath, (err) => {
                if(err) {
                    console.log(err);
                }
            })
        });

        const product = await Product.findByIdAndDelete(productId)

        if (!product) {
            return next(new ErrorHandler("Product is not found with this id", 404));
          }   
          
          res.status(201).json({
            success: true,
            message:"Product Deleted successfully!",
          });

    } catch (err) {
        return next(new ErrorHandler(err.message, 400));
    }
}

async function getAllProducts(req, res, next) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
  
        res.status(201).json({
          success: true,
          products,
        });
      } catch (error) {
        return next(new ErrorHandler(error, 400));
      }

}

module.exports = {
  createProduct,
  getAllShopProducts,
  deleteShopProduct,
  getAllProducts,
}
