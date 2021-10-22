const crypto = require("crypto");

module.exports.getResetPasswordToken = () => {
  const otpCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  const otpCodeExpired = Date.now() + 10 * 60 * 1000;

  return {
    otpCode,
    otpCodeExpired,
  };
};
