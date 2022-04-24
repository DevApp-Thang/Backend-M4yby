const asyncHandle = require("../middlewares/asyncHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const { Follow, Account } = require("../models");

module.exports = {
  addFollow: asyncHandle(async (req, res, next) => {
    const { followId } = req.body;

    if (followId === req.user.id) {
      return next(new ErrorResponse("Bạn không thể theo dõi chính mình.", 400));
    }

    const followAccount = await Account.findByPk(followId);

    if (!followAccount) {
      return next(new ErrorResponse(`Tài khoản không tồn tại.`, 404));
    }

    const oldFollow = await Follow.findOne({
      where: { SelfId: req.user.id, FollowId: followId },
    });

    if (oldFollow) {
      return next(
        new ErrorResponse("Bạn đã theo dõi tài khoản này trước đó.", 400)
      );
    }

    const follow = await Follow.create({
      SelfId: req.user.id,
      FollowId: followId,
    });

    return res.status(201).json({
      success: true,
      data: follow,
    });
  }),
  unfollow: asyncHandle(async (req, res, next) => {
    const { id } = req.params;

    const follow = await Follow.findOne({
      where: {
        SelfId: req.user.id,
        FollowId: id,
      },
    });

    if (!follow) {
      return next(new ErrorResponse(`Bạn chưa theo dõi tài khoản này.`, 404));
    }

    await follow.destroy();

    return res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
