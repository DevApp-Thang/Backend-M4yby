const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helpers/ErrorResponse");
const { Account } = require("../models");
const asyncHandle = require("./asyncHandle");

exports.protect = asyncHandle(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bear")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse(`Không có quyền truy cập.`, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    const user = await Account.findByPk(decoded.id);

    if (!user) {
      return next(new ErrorResponse(`Không có quyền truy cập.`, 401));
    }

    req.user = user;

    next();
  } catch (err) {
    return next(new ErrorResponse(`Không có quyền truy cập.`, 401));
  }
});
