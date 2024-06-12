const Product = require("../models/product.models");
const Shop = require("../models/shop.models");
const ErrorHandler = require("../utilities/ErrorHandler");
const fs = require ("fs");
const cloudinary = require("../Cloudinary/cloudinary.config")


async function createProduct(req, res, next) {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);

    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    }

    const files = req.files;

    if (!files || files.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
        });
      
        // await fs.unlink(file.path).catch(err => console.error(`Failed to delete file: ${file.path}`, err));
        return result.secure_url;
      })
    );

    const productData = req.body;
    productData.images = imageUrls;
    productData.shop = shop._id;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product,
    });
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
