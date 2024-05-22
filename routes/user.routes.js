const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controllers");
const upload = require("../multer")

router.post('/create-user', upload.single('avatar'), userCtrl.createUser);

router.post('/login-user', userCtrl.loginUser);

module.exports = router;