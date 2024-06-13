const express = require('express');
const router = express.Router();
const { isSeller } = require("../middleware/auth");
const shopCtrl = require("../controllers/shop.controllers")
const upload = require("../multer");
const catchAsyncError = require('../middleware/catchAsyncError');

router.post('/create-shop', upload.single("file"), shopCtrl.createShop);

router.post('/login-shop', catchAsyncError(shopCtrl.loginShop));

router.get('/getshop', isSeller, catchAsyncError(shopCtrl.getShop));

router.get('/logout', catchAsyncError(shopCtrl.logoutShop))

router.put('/update-shop-avatar', isSeller, upload.single("file"), catchAsyncError(shopCtrl.updateShopAvatar));

router.put('/update-seller-info', isSeller, catchAsyncError(shopCtrl.updateSellerInfo));


module.exports = router;