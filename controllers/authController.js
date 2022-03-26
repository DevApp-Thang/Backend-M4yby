const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Account, Rate } = require("../models");
const { getResetPasswordToken } = require("../helpers/resetPassword");
const sendEmail = require("../helpers/sendMail");
const uploadFile = require("../helpers/uploadFile");
const axios = require("axios");

var fs = require("fs");
var request = require("request");
const { rejects } = require("assert");

const refreshTokens = {};

const sendTokenResponse = (account, statusCode, res) => {
  const token = account.getSignedJwtToken();
  const refreshToken = account.getSignedJwtRefreshToken();

  const response = {
    token,
    refreshToken,
  };
  refreshTokens[refreshToken] = response;

  return res.status(statusCode).json({
    success: true,
    data: response,
  });
};

module.exports = {
  register: asyncHandle(async (req, res, next) => {
    const { name, phone, email, password, gender } = req.body;

    if (!password) {
      return next(new ErrorResponse("Please enter your password.", 400));
    }

    if (!gender) {
      return next(new ErrorResponse("Please enter your gender.", 400));
    }

    const account = await Account.create({
      name,
      phone,
      email,
      password,
      gender,
      rating: 5,
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

      return res.status(200).json({
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
    const rate = await Rate.findAll({
      where: {
        voterId: req.user.id,
      },
    });

    delete req.user.dataValues.password;

    const data = {
      ...req.user.dataValues,
      countRate: rate.length,
      rating: Number(req.user.dataValues.rating),
    };

    return res.status(200).json({
      success: true,
      data: data,
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

    return res.status(200).json({
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
    return res.status(200).json({
      success: true,
    });
  }),
  resetPassword: asyncHandle(async (req, res, next) => {
    const { otpCode } = req.params;
    const { password } = req.body;

    if (!otpCode) {
      return next(new ErrorResponse(`ResetToken is invalid.`, 400));
    }

    if (!password) {
      return next(new ErrorResponse(`Password is invalid.`, 400));
    }

    const user = await Account.findOne({
      where: {
        otpCode,
        otpCodeExpired: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return next(new ErrorResponse(`Wrong ResetToken.`, 400));
    }

    const newUser = await user.update({
      password,
      otpCode: null,
      otpCodeExpired: null,
    });

    sendTokenResponse(newUser, 200, res);
  }),
  forgotPassword: asyncHandle(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse("Email is invalid", 400));
    }

    const user = await Account.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return next(
        new ErrorResponse(`There is no account with email ${email}`, 400)
      );
    }

    const { otpCode, otpCodeExpired } = getResetPasswordToken();

    await user.update({
      otpCode,
      otpCodeExpired,
    });

    const message = `Mã OTP: ${otpCode}, tồn tại trong 10 phút.`;

    try {
      await sendEmail({
        email: email,
        subejct: "Forgot password",
        message,
      });

      return res.status(200).json({
        success: true,
        data: "Email sent",
      });
    } catch (err) {
      console.log(err.message);

      await user.update({
        otpCode: null,
        otpCodeExpired: null,
      });
      return next(new ErrorResponse(`Email coult not be sent`, 500));
    }
  }),
  validateCode: asyncHandle(async (req, res, next) => {
    const { otpCode } = req.body;

    const user = await Account.findOne({
      where: {
        otpCode,
        otpCodeExpired: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      return next(new ErrorResponse(`Wrong OTP.`, 400));
    }

    return res.status(200).json({
      success: true,
      data: "Success",
    });
  }),
  uploadAvatar: asyncHandle(async (req, res, next) => {
    const avatar = req.files?.avatar;

    if (!avatar) {
      return next(new ErrorResponse("File missing", 400));
    }

    const currentUser = await Account.findByPk(req.user.id);
    const filename = `account-${currentUser.id}`;

    // image name is filename with extension
    const imageName = uploadFile(avatar, filename, next);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`;

    await currentUser.update({ avatar: imageUrl });

    res.status(200).json({ success: true });
  }),

  loginGoogle: asyncHandle(async (req, res, next) => {
    const { idToken } = req.body;

    const { data: profile } = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`
    );

    const oldUser = await Account.findOne({
      where: { subId: profile.sub, type: "google" },
    });

    if (oldUser) {
      return sendTokenResponse(oldUser, 200, res);
    }

    const { sub, email, name, picture } = profile;
    const account = await Account.create({
      subId: sub,
      email,
      name,
      avatar: picture,
      rating: 5,
      type: "google",
    });

    return sendTokenResponse(account, 200, res);
  }),

  loginFacebook: asyncHandle(async (req, res, next) => {
    const { accessToken } = req.body;

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/v3.1/me?fields=id,name,email,gender,location,picture.type(large)&access_token=${accessToken}`
    );

    if (!profile) {
      return next(new ErrorResponse("not found", 404));
    }

    const { email, id: subId, name, picture } = profile;

    let user;
    user = await Account.findOne({ where: { type: "facebook", subId } });

    if (!user) {
      user = await Account.create({
        email,
        subId,
        type: "facebook",
        name,
        rating: 5,
      });
    }

    if (picture?.data?.url) {
      const pictureUrl = picture.data.url;
      const filename = `account-${user.id}.png`;

      const download = (uri, filename, callback) =>
        new Promise((resolve, rejects) => {
          {
            request.head(uri, function (err, res, body) {
              request(uri)
                .pipe(fs.createWriteStream(filename))
                .on("close", () => resolve(callback()));
            });
          }
        });

      let imageUrl;
      await download(pictureUrl, `public/images/${filename}`, function () {
        imageUrl = `${req.protocol}://${req.get("host")}/images/${filename}`;
        console.log("done");
      });

      user.avatar = imageUrl;
      await user.save();
    }

    return sendTokenResponse(user, 200, res);
  }),
};
