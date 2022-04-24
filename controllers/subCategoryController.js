const ErrorResponse = require("../helpers/ErrorResponse");
const uploadFile = require("../helpers/uploadFile");
const asyncHandle = require("../middlewares/asyncHandle");
const { SubCategory } = require("../models");

module.exports = {
  getSubCategories: asyncHandle(async (req, res, next) => {
    const { page, limit, getAll } = req.query;
    const query = {
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
      where: {
        CategoryId: req.params.id,
      },
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
  createSubCategory: asyncHandle(async (req, res, next) => {
    const { name, categoryId } = req.body;
    const thumbnail = req.files?.thumbnail;

    if (!thumbnail) {
      return next(new ErrorResponse("Không tìm thấy file.", 400));
    }

    let subCategory = await SubCategory.create({
      name,
      CategoryId: categoryId || req.params.id,
    });

    const filename = `sub_category-${subCategory.id}`;
    const imageName = uploadFile(thumbnail, filename, next);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`;

    await subCategory.update({ thumbnail: imageUrl });

    res.status(201).json({ success: true, data: subCategory });
  }),
};
