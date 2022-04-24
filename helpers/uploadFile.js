const ErrorResponse = require("./ErrorResponse");
const path = require("path");

function uploadFile(file, filename, next) {
  if (!file.mimetype.startsWith("image")) {
    return next(
      new ErrorResponse(`Không hỗ trợ định dạng ${file.mimetype}`, 400)
    );
  }

  if (process.env.MAX_SIZE_UPLOAD && file.size > process.env.MAX_SIZE_UPLOAD) {
    return next(new ErrorResponse(`File vượt quá dung lượng cho phép.`, 400));
  }

  file.name = `${filename}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FOLDER_DEFAULT}/${file.name}`, (error) => {
    if (error) {
      return next(new ErrorResponse("Tải lên không thành công.", 400));
    }
  });

  return file.name;
}

module.exports = uploadFile;
