const Order = require("../models/order.models");
const Product = require("../models/product.models");
const mongoose = require("mongoose");

async function createOrder(req, res) {
  try {
    const { shippingAddress, totalPrice, cart, paymentMethod } = req.body;

    const validProductIds = cart.every((item) =>
      mongoose.Types.ObjectId.isValid(item._id)
    );
    if (!validProductIds) {
      return res.status(400).json({
        success: false,
        message: "Invalid product IDs provided in the order",
      });
    }

    const productsDetails = await Product.find({
      _id: { $in: cart.map((item) => item._id) },
    });

    if (productsDetails.length !== cart.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found",
      });
    }

    const products = cart.map((item) => {
      const productDetail = productsDetails.find(
        (p) => p._id.toString() === item._id
      );
      return {
        product: item._id,
        name: productDetail.name,
        image: productDetail.images[0],
        quantity: item.qty,
        price: item.price,
      };
    });

    const order = await Order.create({
      user: req.user._id,
      shippingAddress,
      totalPrice,
      paymentMethod,
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
    const productIds = products.map((product) => product._id);

    const orders = await Order.find({
      "products.product": { $in: productIds },
    })
      .populate("user")
      .populate("products.product");

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
