const express = require('express');
const cors = require('cors');
const ErrorHandler = require('./utilities/ErrorHandler');
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require('dotenv').config();
require('./config/database')

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("assets"));
app.use(bodyParser.urlencoded({extended: true, limit:"50mb"}));

const userRoute = require("./routes/user.routes");

app.use("/api/user", userRoute)

app.use(ErrorHandler);


const PORT = 4000;

app.listen(PORT, function() {
    console.log(`Express app is running on port ${PORT}`);
})