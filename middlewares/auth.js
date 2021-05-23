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
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

    req.user = await Account.findByPk(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse(`Not authorize to access this route`, 401));
  }
});