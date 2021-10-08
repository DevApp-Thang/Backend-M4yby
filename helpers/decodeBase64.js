const Buffer = require("buffer").Buffer;
const path = require("path");
const fs = require("fs");
const mime = require("mime");
const ErrorResponse = require("./ErrorResponse");

exports.decodeBase64 = (base64str, filename) => {
  try {
    const matches = base64str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

    if (matches.length !== 3) {
      throw new ErrorResponse("Base64 is invalid", 403);
    }

    const dataImage = {};

    dataImage.type = matches[1];
    dataImage.data = new Buffer.from(matches[2], "base64");
    const decodedImg = dataImage;
    const imageBuffer = decodedImg.data;
    const type = decodedImg.type;
    const extension = mime.extension(type);
    const fileName = `${filename}.${extension}`;

    fs.writeFileSync(
      path.join(__dirname, "../public/images/", fileName),
      imageBuffer,
      "utf8"
    );
    return true;
  } catch (error) {
    throw new ErrorResponse(`Faild to upload image: ${error.message}`, 403);
  }
};
