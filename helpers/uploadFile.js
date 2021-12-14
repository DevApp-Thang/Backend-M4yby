const ErrorResponse = require("./ErrorResponse");
const path = require("path");

function uploadFile(file, filename, next) {
  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(`File type ${file.mimetype} is not supported`, 400)
    );
  }

  if (process.env.MAX_SIZE_UPLOAD && file.size > process.env.MAX_SIZE_UPLOAD) {
    return next(new ErrorResponse(`File size exceeds the allowed size`, 400));
  }

  file.name = `${filename}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FOLDER_DEFAULT}/${file.name}`, (error) => {
    if (error) {
      return next(new ErrorResponse("Upload file failed", 400));
    }
  });

  return file.name;
}

module.exports = uploadFile;
