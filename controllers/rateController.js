const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Rate, Item, sequelize } = require("../models");

module.exports = {
  create: asyncHandle(async (req, res, next) => {
    const item = await Item.findOne({
      where: {
        id: req.body.itemId,
      },
    });
    if (!item) {
      return next(
        new ErrorResponse(`Can't find item with id ${req.body.itemId}`, 404)
      );
    }

    const rate = await Rate.findOne({
      where: {
        itemId: req.body.itemId,
        voterId: req.user.id,
      },
    });

    if (!rate) {
      if (item.AccountId === req.user.id) {
        return next(new ErrorResponse(`You cannot rate this product`, 400));
      }
      return next(
        new ErrorResponse(`You have already rated this product`, 400)
      );
    } else {
      // if (item.AccountId === req.user.id) {
      //   return next(new ErrorResponse(`You cannot rate this product`, 400));
      // }
      const transaction = await sequelize.transaction();
      try {
        const newRate = await Rate.create(
          {
            value: req.body.value,
            description: req.body.description,
            sellerId: item.AccountId,
            voterId: req.user.id,
            itemId: req.body.itemId,
          },
          { transaction }
        );

        const { rows, count } = await Rate.findAndCountAll({
          where: {
            itemId: req.body.itemId,
          },
        });
        const sumRate = [...rows, newRate.dataValues].reduce(
          (a, b) => a + b.value,
          0
        );

        const avgRate = Math.round((sumRate / (count + 1)) * 10) / 10;

        await item.update(
          {
            rating: avgRate,
          },
          {
            transaction,
          }
        );

        const rateUser = await Item.findAndCountAll({
          where: {
            AccountId: req.user.id,
          },
        });

        const sumRateUser = rateUser.rows.reduce((a, b) => {
          if (b.AccountId === item.AccountId) {
            return a + avgRate;
          }
          return a + b.rating;
        }, 0);

        const avgRateUser =
          Math.round((sumRateUser / rateUser.count) * 10) / 10;

        await req.user.update(
          {
            rating: avgRateUser,
          },
          {
            transaction,
          }
        );

        await transaction.commit();
        return res.status(201).json({
          success: true,
          data: newRate,
        });
      } catch (err) {
        await transaction.rollback();
        return next(new ErrorResponse(err.message, 400));
      }
    }
  }),
};
