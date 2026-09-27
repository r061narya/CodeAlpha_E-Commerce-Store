const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;


        // Check required fields
        if (!username || !email || !password) {

            return res.status(400).json({
                message: "Please fill all fields"
            });

        }


        // Check existing username/email
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });


        if (existingUser) {

            return res.status(400).json({
                message: "Username or email already exists"
            });

        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({

            username,

            email,

            password: hashedPassword

        });


        res.status(201).json({

            message: "Account created successfully",

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields
        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });

        }


        // Find user
        const user = await User.findOne({
            email: email
        });


        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Check password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                userId: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        res.json({

            message: "Login successful",

            token,

            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;