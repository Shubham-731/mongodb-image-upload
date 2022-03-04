const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Image = require("../models/Image");

const router = express.Router();

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      crypto.randomBytes(10).toString("hex") + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// @route GET /
// @desc - Display the HTML UI for home page
router.get("/", (req, res) => {
  Image.find({}, (err, items) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred", err);
    } else {
      res.render("index", { items });
    }
  });
});

// @route POST /upload
// @desc - Route handler to upload the image
router.post("/upload", upload.single("image"), (req, res) => {
  const uploadImage = {
    title: req.body.title,
    desc: req.body.desc,
    img: {
      data: fs.readFileSync(
        path.join(__dirname, "../public/uploads", req.file.filename)
      ),
      contentType: req.file.mimetype,
    },
  };

  const allowedExt = /jpeg|png|jpg|gif/;

  if (allowedExt.test(uploadImage.img.contentType)) {
    Image.create(uploadImage, (err, item) => {
      if (err) {
        console.log(err);
      } else {
        let msg = "File uploaded successfully!";
        console.log(msg);
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
    console.log("File not supported. Images only!");
  }
});

// @route GET /del/:id
// @desc - Delete the image with given id
router.delete("/del/:id", async (req, res) => {
  await Image.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(404).json({ Error: err });
    }

    res.redirect("/");
  });
});

module.exports = router;
