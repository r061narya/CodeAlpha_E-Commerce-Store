const multer = require("multer");
const path = require("path");


// =========================
// STORAGE
// =========================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        if (file.fieldname === "profilePicture") {

            cb(null, "uploads/profiles");

        } else {

            cb(null, "uploads/posts");

        }

    },


    filename: (req, file, cb) => {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);


        cb(null, uniqueName);

    }

});


// =========================
// FILE FILTER
// =========================

const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    ];


    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error("Only JPG, PNG and WEBP images are allowed"),
            false
        );

    }

};


// =========================
// MULTER
// =========================

const upload = multer({

    storage: storage,

    fileFilter: fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});


module.exports = upload;