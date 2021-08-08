const asyncHandle = require("../middlewares/asyncHandle");
const { SubCategory } = require("../models");

module.exports = {
  getSubCategories: asyncHandle(async (req, res, next) => {
    const { page, limit, getAll } = req.query;
    const query = {
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    };

    let subCategories;
    let pagination;

    if (getAll == 0) {
      const limitPerPage = Number(limit) || 10;
      query.offset = (Number(page || 1) - 1) * limitPerPage;
      query.limit = limitPerPage;
      subCategories = await SubCategory.findAndCountAll(query);
      pagination = {
        page: Number(page || 1),
        total: subCategories.count,
      };
    } else {
      subCategories = await SubCategory.findAll(query);
    }

    return res.status(200).json({
      success: true,
      data: subCategories.rows || subCategories,
      pagination,
    });
  }),
};
