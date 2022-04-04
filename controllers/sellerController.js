const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Account, Item, Follow, Rate } = require("../models");

module.exports = {
  getSellerDetail: asyncHandle(async (req, res, next) => {
    const { sellerId } = req.params;

    const seller = await Account.scope("forSeller").findByPk(sellerId, {
      include: [{ model: Item, as: "items" }],
    });

    const countRate = await Rate.count({ sellerId });
    const follow = await Follow.findOne({
      where: { SelfId: req.user.id, FollowId: sellerId },
    });
    const countFollower = await Follow.count({ where: { FollowId: sellerId } });
    const countFollowing = await Follow.count({ where: { SelfId: sellerId } });

    const data = {
      ...seller.dataValues,
      countRate,
      isFollowing: follow ? true : false,
      countFollower,
      countFollowing,
    };

    if (!seller) {
      return next(
        new ErrorResponse(`Not found seller with id ${sellerId}`, 404)
      );
    }

    res.status(200).json({ success: true, data });
  }),
};
