const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controllers");

router.post('/create-user', userCtrl.createUser);

module.exports = router;