const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middleware/auth");
const shopCtrl = require("../controllers/shop.controllers")
const upload = require("../multer")

router.post('/create-shop', upload.single("file"), shopCtrl.createShop);

module.exports = router;