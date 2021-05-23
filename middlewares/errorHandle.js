const ErrorResponse = require("../helpers/ErrorResponse");

const errorHandle = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  console.log("Error hehe:", err);

  if (err.name === "SequelizeValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  if (err.name === "SequelizeConnectionRefusedError") {
    const message = "Database connection error";
    error = new ErrorResponse(message, 500);
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandle;
