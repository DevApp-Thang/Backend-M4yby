const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Rate, Item } = require("../models");

module.exports = {
  create: asyncHandle(async (req, res, next) => {
    const item = await Item.findByPk(req.itemId);
    if (!item) {
      return next(
        new ErrorResponse(`Can't find item with id ${req.itemId}`, 404)
      );
    }

    const rate = await Rate.findOne({
      where: {
        itemId: req.itemId,
        voterId: req.user.id,
      },
    });

    if (rate) {
      if (rate.sellerId === req.user.id) {
        return next(new ErrorResponse(`You cannot rate this product`, 400));
      }
      return next(
        new ErrorResponse(`You have already rated this product`, 400)
      );
    } else {
      const newRate = await Rate.create({
        value: req.value,
        description: req.description,
        sellerId: item.AccountId,
        voterId: req.user.id,
        itemId: req.itemId,
      });

      return res.status(201).json({
        success: true,
        data: newRate,
      });
    }
  }),
};
