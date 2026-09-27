const express = require("express");

const User = require("../models/User");


const authMiddleware =
require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================
// GET USER PROFILE
// =========================

router.get("/:username", async (req, res) => {

    try {

        const user = await User.findOne({
            username: req.params.username
        })
        .select("-password");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// =========================
// UPDATE PROFILE
// =========================

router.put(
    "/:id",
    authMiddleware,
    upload.single("profilePicture"),
    async (req, res) => {

        try {

            // Logged-in user ID comes from JWT
            const userId = req.userId;


            // Find user
            const user =
                await User.findById(userId);


            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            // Update bio if provided
            if (req.body.bio !== undefined) {

                user.bio = req.body.bio;

            }


            // Update profile picture if uploaded
            if (req.file) {

                user.profilePicture =
                    `/uploads/profiles/${req.file.filename}`;

            }


            // Save changes
            await user.save();


            // Remove password from response
            const userResponse =
                user.toObject();

            delete userResponse.password;


            res.json({

                message: "Profile updated successfully",

                user: userResponse

            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error"
            });

        }

    }
);


// =========================
// FOLLOW USER
// =========================

router.post(
    "/:id/follow",
    authMiddleware,
    async (req, res) => {

        try {

            // Logged-in user's ID comes from JWT
            const currentUserId = req.userId;

            // User we want to follow
            const targetUserId = req.params.id;


            // Prevent following yourself
            if (currentUserId.toString() === targetUserId) {

                return res.status(400).json({
                    message: "You cannot follow yourself"
                });

            }


            // Find both users
            const currentUser =
                await User.findById(currentUserId);

            const targetUser =
                await User.findById(targetUserId);


            // Check users exist
            if (!currentUser || !targetUser) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            // Check already following
            if (
                currentUser.following
                    .map(id => id.toString())
                    .includes(targetUserId)
            ) {

                return res.status(400).json({
                    message: "Already following this user"
                });

            }


            // Add target user to following
            currentUser.following.push(targetUserId);


            // Add current user to target's followers
            targetUser.followers.push(currentUserId);


            // Save both users
            await currentUser.save();

            await targetUser.save();


            res.json({
                message: "User followed successfully"
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error"
            });

        }

    }
);
// =========================
// UNFOLLOW USER
// =========================

router.delete(
    "/:id/follow",
    authMiddleware,
    async (req, res) => {

        try {

            // Logged-in user's ID comes from JWT
            const currentUserId = req.userId;

            // User we want to unfollow
            const targetUserId = req.params.id;


            // Find both users
            const currentUser =
                await User.findById(currentUserId);

            const targetUser =
                await User.findById(targetUserId);


            // Check users exist
            if (!currentUser || !targetUser) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            // Remove target from following
            currentUser.following =
                currentUser.following.filter(
                    id =>
                        id.toString() !==
                        targetUserId.toString()
                );


            // Remove current user from target's followers
            targetUser.followers =
                targetUser.followers.filter(
                    id =>
                        id.toString() !==
                        currentUserId.toString()
                );


            // Save both users
            await currentUser.save();

            await targetUser.save();


            res.json({
                message: "User unfollowed successfully"
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Server error"
            });

        }

    }
);


module.exports = router;