const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    stock: Number
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;