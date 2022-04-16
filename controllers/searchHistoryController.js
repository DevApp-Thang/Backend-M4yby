const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { SearchHistory } = require("../models");

module.exports = {
  getSearchHistory: asyncHandle(async (req, res, next) => {
    let { page, limit } = req.query;

    if (!page) {
      page = 1;
    }

    const limitPerPage = Number(limit) || 10;

    const keywords = await SearchHistory.findAndCountAll({
      attributes: ["id", "keyword"],
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: [["id", "DESC"]],
      where: {
        AccountId: req.user.id,
      },
    });

    return res.status(200).json({
      success: true,
      data: keywords.rows,
      pagination: {
        page: Number(page),
        total: keywords.count,
      },
    });
  }),

  deleteSearchHistory: asyncHandle(async (req, res, next) => {
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return next(new ErrorResponse("Id must be a number", 400));
    }

    const keyword = await SearchHistory.findByPk(id);

    if (!keyword) {
      return next(new ErrorResponse(`Cannot find keyword with id ${id}`, 404));
    }

    if (keyword.AccountId !== req.user.id) {
      return next(
        new ErrorResponse(`You are not allowed to perform this action`, 401)
      );
    }

    await keyword.destroy();

    return res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
