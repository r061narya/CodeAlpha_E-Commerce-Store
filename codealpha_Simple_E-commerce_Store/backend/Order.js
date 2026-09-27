const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: String,

    customerName: String,

    phone: String,

    address: String,

    city: String,

    pincode: String,

    products: [

        {
            name: String,
            price: Number,
            quantity: Number
        }

    ],

    total: Number,

    status: {
        type: String,
        default: "Pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});


const Order =
    mongoose.model("Order", orderSchema);


module.exports = Order;