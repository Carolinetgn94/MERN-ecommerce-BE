const Order = require("../models/order.models");
const Product = require("../models/product.models")

async function createOrder(req, res) {
  try {
    const { shippingAddress, totalPrice, products } = req.body;

    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      totalPrice,
      products,
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "products.product"
    );

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


async function getShopOrders(req, res) {
    try {
        const products = await Product.find({ shopId: req.user._id });
        const productIds = products.map(product => product._id);
    
        const orders = await Order.find({
          "products.product": { $in: productIds },
        }).populate("user").populate("products.product");
    
        res.status(200).json({
          success: true,
          orders,
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
}



module.exports = {
  createOrder,
  getUserOrders,
  getShopOrders,
};
