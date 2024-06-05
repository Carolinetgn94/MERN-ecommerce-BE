const Product = require("../models/product.models");
const Shop = require("../models/shop.models");
const ErrorHandler = require("../utilities/ErrorHandler");

async function createProduct(req, res, next) {
  try {
    const shopId = req.body.shopId;
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return next(new ErrorHandler("Shop Id is invalid!", 400));
    } else {
      const files = req.files;
      const imageUrls = files.map((file) => `${file.fileName}`);
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

module.exports = {
  createProduct,
};
