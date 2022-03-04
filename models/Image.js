const mongoose = require("mongoose");

const imgSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  img: {
    data: Buffer,
    contentType: String,
  },
});

const Image = mongoose.model("Image", imgSchema);

module.exports = Image;
