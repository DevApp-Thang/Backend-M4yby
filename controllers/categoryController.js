const asyncHandle = require("../middlewares/asyncHandle");
const { Category } = require("../models");

module.exports = {
  getCategories: asyncHandle(async (req, res, next) => {
    const { page, limit, getAll } = req.query;
    const query = {
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    };

    let categories;
    let pagination;

    if (getAll == 0) {
      const limitPerPage = Number(limit) || 10;
      query.offset = (Number(page || 1) - 1) * limitPerPage;
      query.limit = limitPerPage;
      categories = await Category.findAndCountAll(query);
      pagination = {
        page: Number(page || 1),
        total: categories.count,
      };
    } else {
      categories = await Category.findAll(query);
    }

    return res.status(200).json({
      success: true,
      data: categories.rows || categories,
      pagination,
    });
  }),
};
