const express = require('express');
const upload = require('../multer');
const router = express.Router();
const productCtrl = require("../controllers/product.controllers");
const catchAsyncError = require("../middleware/catchAsyncError");
const { isSeller } = require('../middleware/auth');


router.post('/create-product', upload.array("images"), catchAsyncError(productCtrl.createProduct));

router.get('/get-all-products-shop/:id', catchAsyncError(productCtrl.getAllShopProducts));

router.delete('/delete-shop-product/:id', isSeller, catchAsyncError(productCtrl.deleteShopProduct));

router.get('/get-all-products', catchAsyncError(productCtrl.getAllProducts));


module.exports = router;