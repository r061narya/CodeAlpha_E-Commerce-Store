const express = require("express");

const Post = require("../models/Post");
const Comment = require("../models/Comment");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// =========================
// CREATE POST
// =========================

router.post(
    "/",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
        try {
            const user = req.userId;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({
                    message: "Post content is required"
                });
            }

            let image = "";

            if (req.file) {
                image = `/uploads/posts/${req.file.filename}`;
            }

            const post = await Post.create({
                user: user,
                content: content,
                image: image
            });

            const populatedPost = await post.populate(
                "user",
                "username profilePicture"
            );

            res.status(201).json({
                message: "Post created successfully",
                post: populatedPost
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
// GET ALL POSTS
// =========================

router.get("/", async (req, res) => {

    try {

        const posts = await Post.find()

            .populate(
                "user",
                "username profilePicture"
            )

            .sort({
                createdAt: -1
            });


        res.json(posts);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =========================
// DELETE POST
// =========================

router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        await Post.findByIdAndDelete(req.params.id);


        await Comment.deleteMany({
            post: req.params.id
        });


        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


// =========================
// LIKE / UNLIKE POST
// =========================

router.post("/:id/like",  authMiddleware, async (req, res) => {

    try {

        const userId = req.userId;


        if (!userId) {

            return res.status(400).json({
                message: "User ID is required"
            });

        }


        const post =
            await Post.findById(req.params.id);


        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }


        const alreadyLiked =
            post.likes.includes(userId);


        if (alreadyLiked) {

            post.likes =
                post.likes.filter(

                    id => id.toString() !== userId

                );

        } else {

            post.likes.push(userId);

        }


        await post.save();


        res.json({

            message: alreadyLiked
                ? "Post unliked"
                : "Post liked",

            likes: post.likes.length

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

// =========================
// ADD COMMENT
// =========================

router.post(
    "/:id/comments",
    authMiddleware,
    async (req, res) => {

        try {

            // Get logged-in user from JWT
            const user = req.userId;

            // Get comment text from request
            const { text } = req.body;


            // Check comment text
            if (!text) {

                return res.status(400).json({
                    message: "Comment text is required"
                });

            }


            // Check post exists
            const post =
                await Post.findById(req.params.id);


            if (!post) {

                return res.status(404).json({
                    message: "Post not found"
                });

            }


            // Create comment
            const comment =
                await Comment.create({

                    post: req.params.id,

                    user: user,

                    text: text

                });


            // Get user information
            const populatedComment =
                await comment.populate(
                    "user",
                    "username profilePicture"
                );


            res.status(201).json({

                message: "Comment added successfully",

                comment: populatedComment

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
// GET COMMENTS
// =========================

router.get("/:id/comments", async (req, res) => {

    try {

        const comments =
            await Comment.find({
                post: req.params.id
            })

            .populate(
                "user",
                "username profilePicture"
            )

            .sort({
                createdAt: 1
            });


        res.json(comments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});


module.exports = router;