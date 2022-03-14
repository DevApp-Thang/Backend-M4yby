const ErrorResponse = require("../helpers/ErrorResponse");
const asyncHandle = require("../middlewares/asyncHandle");
const { Category } = require("../models");
const uploadFile = require("../helpers/uploadFile");

module.exports = {
  getCategories: asyncHandle(async (req, res, next) => {
    const { page, limit, getAll } = req.query;
    const query = {
      attributes: ["id", "name", "thumbnail"],
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
  createCategory: asyncHandle(async (req, res, next) => {
    const { name } = req.body;
    const thumbnail = req.files?.thumbnail;

    if (!thumbnail) {
      return next(new ErrorResponse("File missing", 400));
    }

    let category = await Category.create({ name });

    const filename = `category-${category.id}`;
    const imageName = uploadFile(thumbnail, filename, next);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`;

    await category.update({ thumbnail: imageUrl });

    res.status(201).json({ success: true, data: category });
  }),
};
