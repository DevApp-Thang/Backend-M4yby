const asyncHandle = require("../middlewares/asyncHandle");
const { Item } = require("../models");
const { Transaction } = require("sequelize");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createItem: asyncHandle(async (req, res, next) => {
    const transaction = new Transaction();

    try {
      const item = await Item.create(req.body, {
        transaction,
      });

      await transaction.commit();

      res.status(201).json({
        success: true,
      });
    } catch (err) {
      await transaction.rollback();

      return next(new ErrorResponse(err.message, 400));
    }
  }),
};
