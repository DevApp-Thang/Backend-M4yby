const ErrorResponse = require("../helpers/ErrorResponse");
const uploadFile = require("../helpers/uploadFile");
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
  createProduct: asyncHandle(async (req, res, next) => {
    const { name, subCategoryId } = req.body;
    const thumbnail = req.files?.thumbnail;

    if (!thumbnail) {
      return next(new ErrorResponse("Không tìm thấy file.", 400));
    }

    let product = await Product.create({
      name,
      SubcategoryId: subCategoryId || req.params.sub_id,
    });

    const filename = `product-${product.id}`;
    const imageName = uploadFile(thumbnail, filename, next);
    const imageUrl = `${req.protocol}://${req.get("host")}/images/${imageName}`;

    await product.update({ thumbnail: imageUrl });

    res.status(201).json({ success: true, data: product });
  }),
};
