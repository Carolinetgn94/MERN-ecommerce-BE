const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        require: [true, "Please enter product name!"]
    },
    description: {
        type: String,
        required: [true, "Please enter your product description!"],
      },
      category: {
        type: String,
        required: [true, "Please enter your product category!"],
      },
      price: {
        type: Number,
      },
      images: [
        {
            type: String,
        }
      ],
      shopId: {
        type: String,
        required: true,
      },
      shop: {
        type: Object,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
})

module.exports = mongoose.model("Product", productSchema);