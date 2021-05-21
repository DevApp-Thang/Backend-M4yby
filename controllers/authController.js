const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Account } = require("../models");
const refreshTokens = {};

const sendTokenResponse = (account, statusCode, res) => {
  const token = account.getSignedJwtToken();
  const refreshToken = account.getSignedJwtRefreshToken();

  const response = {
    token,
    refreshToken,
  };
  refreshTokens[refreshToken] = response;

  res.status(statusCode).json({
    success: true,
    data: response,
  });
};

module.exports = {
  register: asyncHandle(async (req, res, next) => {
    const { name, phone, email, password, gender } = req.body;

    const account = await Account.create({
      name,
      phone,
      email,
      password,
      gender,
    });

    sendTokenResponse(account, 201, res);
  }),

  login: asyncHandle(async (req, res, next) => {
    const { phone, email, password } = req.body;

    let query = { phone, email };

    if (!phone && !email) {
      return next(
        new ErrorResponse(
          "Please enter your email address or phone number",
          400
        )
      );
    }

    if (!password) {
      return next(new ErrorResponse("Please enter your password", 400));
    }

    if (!phone) {
      query = { email };
    }

    if (!email) {
      query = { phone };
    }

    const account = await Account.findOne({
      where: {
        [Op.or]: query,
      },
    });

    if (!account) {
      return next(new ErrorResponse(`Cannot find account`, 400));
    }

    const isMatch = await account.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse(`Wrong password`, 401));
    }

    sendTokenResponse(account, 200, res);
  }),

  sendToken: asyncHandle(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (refreshToken && refreshToken in refreshTokens) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.SECRET_REFRESH_TOKEN
      );

      const account = await Account.findByPk(decoded.id);

      if (!account) {
        return next(new ErrorResponse("Unauthorized", 401));
      }

      const token = account.getSignedJwtToken();
      refreshTokens[refreshToken].token = token;

      res.status(200).json({
        success: true,
        token,
      });
    } else {
      return res.status(401).json({
        success: false,
        data: "RefreshToken is invalid.",
      });
    }
  }),
  getMe: asyncHandle(async (req, res, next) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  }),
  updateDetails: asyncHandle(async (req, res) => {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
    };

    const currentUser = await Account.findByPk(req.user.id);

    const user = await currentUser.update(fieldsToUpdate);

    res.status(200).json({
      success: true,
      data: user,
    });
  }),
  updatePassword: asyncHandle(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return next(new ErrorResponse("Please enter your password.", 301));
    }

    if (!newPassword) {
      return next(new ErrorResponse("Please enter new password", 301));
    }

    const currentUser = await Account.findByPk(req.user.id);

    const isMatch = await currentUser.matchPassword(currentPassword);

    if (!isMatch) {
      return next(new ErrorResponse(`Wrong password`, 401));
    }

    const user = await currentUser.update({
      password: newPassword,
    });

    // sendTokenResponse(user, 200, res);
    res.status(200).json({
      success: true,
    });
  }),
};
