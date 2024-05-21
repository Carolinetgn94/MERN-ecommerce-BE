const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database')

const app = express();
app.use(cors());
app.use(express.json());


const PORT = 4000;

app.listen(PORT, function() {
    console.log(`Express app is running on port ${PORT}`);
})