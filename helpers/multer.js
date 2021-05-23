const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..public/images"));
  },
  filename: (req, file, cb) => {
    const { id } = req.user;
    const filename = file.originalname.split(".");
    console.log("filename", filename);
    const fileExt = filename[filename.length - 1];
    cb(null, `${id}.${fileExt}`);
  },
});

const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(`Not allowed to upload`, false);
    }
  },
});

module.exports = uploadImage;
