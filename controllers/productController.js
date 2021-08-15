const asyncHandle = require("../middlewares/asyncHandle");
const { Product } = require("../models");

module.exports = {
  getProducts: asyncHandle(async (req, res, next) => {
    const { page, limit, getAll } = req.query;
    const { sub_id } = req.params;
    const query = {
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
      where: {
        SubcategoryId: sub_id,
      },
    };

    let products;
    let pagination;

    if (getAll == 0) {
      const limitPerPage = Number(limit) || 10;
      query.offset = (Number(page || 1) - 1) * limitPerPage;
      query.limit = limitPerPage;
      products = await Product.findAndCountAll(query);
      pagination = {
        page: Number(page || 1),
        total: products.count,
      };
    } else {
      products = await Product.findAll(query);
    }

    return res.status(200).json({
      success: true,
      data: products.rows || products,
      pagination,
    });
  }),
};
