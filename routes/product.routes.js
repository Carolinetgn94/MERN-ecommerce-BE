const express = require('express');
const upload = require('../multer');
const router = express.Router();
const productCtrl = require("../controllers/product.controllers");
const catchAsyncError = require("../middleware/catchAsyncError");


router.post('/create-product', upload.array("images"), catchAsyncError(productCtrl.createProduct));

module.exports = router;