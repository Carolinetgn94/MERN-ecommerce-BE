const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controllers");
const upload = require("../multer")
const catchAsyncError = require("../middleware/catchAsyncError");
const {isAuthenticated} = require("../middleware/auth");

router.post('/create-user', upload.single('avatar'), userCtrl.createUser);

router.post('/login-user', catchAsyncError(userCtrl.loginUser));

router.get('/getuser', isAuthenticated, catchAsyncError(userCtrl.getUser));

module.exports = router;