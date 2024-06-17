const express = require("express");
const orderCtrl = require("../controllers/order.controller")
const { isAuthenticated, isSeller } = require("../middleware/auth");

const router = express.Router();

router.post("/create-order", isAuthenticated, orderCtrl.createOrder);
router.get("/user-orders", isAuthenticated, orderCtrl.getUserOrders);
router.get("/shop-orders", isSeller, orderCtrl.getShopOrders);

module.exports = router;
