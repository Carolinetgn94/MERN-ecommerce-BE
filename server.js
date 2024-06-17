const express = require("express");
const cors = require("cors");
const ErrorHandler = require("./utilities/ErrorHandler");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./config/database");


const app = express();
app.use(
  cors({
    origin: "fe-mern-ecommerce-j5d87xkz1-caroline-s-projects-7d2765cf.vercel.app",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));


const userRoute = require("./routes/user.routes");
const shopRoute = require("./routes/shop.routes");
const productRoute = require("./routes/product.routes");
const orderRoute = require("./routes/order.routes");

app.use("/api/user", userRoute);
app.use("/api/shop", shopRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);


app.use(ErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, function () {
  console.log(`Express app is running on port ${PORT}`);
});
