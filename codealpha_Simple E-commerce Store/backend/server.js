

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const Product = require("./Product");
const User = require("./User");

const app = express();

const PORT = 5000;


// Middleware
app.use(express.json());
app.use(cors());


// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// Home Route
app.get("/", (req, res) => {
    res.send("E-Commerce Backend is Running!");
});


// Get all products
app.get("/products", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Error getting products"
        });

    }

});

// Get single product
app.get("/products/:id", async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error getting product"
        });

    }

});


// Add product
app.post("/products", async (req, res) => {

    try {

        const product = new Product(req.body);

        await product.save();

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error adding product"
        });

    }

});


// Delete product
app.delete("/products/:id", async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting product"
        });

    }

});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


// ================= REGISTER =================

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });

        }


        const hashedPassword =
            await bcrypt.hash(password, 10);


        const user = new User({

            name,
            email,
            password: hashedPassword

        });


        await user.save();


        res.json({
            message: "Registration successful"
        });


    } catch (error) {

        res.status(500).json({
            message: "Registration failed"
        });

    }

});


// ================= LOGIN =================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        const user =
            await User.findOne({ email });


        if (!user) {

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(400).json({
                message: "Invalid email or password"
            });

        }


        res.json({

            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (error) {

        res.status(500).json({
            message: "Login failed"
        });

    }

});

const Order = require("./Order");

// ================= CREATE ORDER =================

app.post("/orders", async (req, res) => {

    try {

        const order = new Order(req.body);

        await order.save();


        res.json({

            message: "Order placed successfully",

            order: order

        });


    } catch (error) {

        res.status(500).json({

            message: "Order failed"

        });

    }

});