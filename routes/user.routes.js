const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controllers");
const catchAsyncError = require("../middleware/catchAsyncError");
const {isAuthenticated} = require("../middleware/auth");
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

router.post('/create-user', upload.single("avatar"), userCtrl.createUser);

router.post('/login-user', catchAsyncError(userCtrl.loginUser));

router.get('/getuser', isAuthenticated, catchAsyncError(userCtrl.getUser));

router.get('/logout', catchAsyncError(userCtrl.logoutUser))

router.put('/update-user-info', isAuthenticated, catchAsyncError(userCtrl.updateUserInfo));

router.put('/update-avatar', isAuthenticated, upload.single("image"), catchAsyncError(userCtrl.updateUserAvatar));

router.put('/update-user-addresses', isAuthenticated, catchAsyncError(userCtrl.updateUserAddress));

router.delete('/delete-user-address/:id', isAuthenticated, catchAsyncError(userCtrl.deleteUserAddress));

router.put('/update-user-password', isAuthenticated, catchAsyncError(userCtrl.updateUserPassword));


module.exports = router;