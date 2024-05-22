const express = require('express');
const cors = require('cors');
const ErrorHandler = require('./utilities/ErrorHandler');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require('dotenv').config();
require('./config/database')

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));
app.use(fileUpload({useTempFiles: true}));
app.use(ErrorHandler);


const PORT = 4000;

app.listen(PORT, function() {
    console.log(`Express app is running on port ${PORT}`);
})