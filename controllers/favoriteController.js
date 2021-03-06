const asyncHandle = require("../middlewares/asyncHandle");
const ErrorResponse = require("../helpers/ErrorResponse");
const { Favorite, Item, ItemImage, Product, Location } = require("../models");

module.exports = {
  getFavorites: asyncHandle(async (req, res, next) => {
    let { page, limit } = req.query;

    if (!page) {
      page = 1;
    }

    const limitPerPage = Number(limit) || 10;

    const favorites = await Favorite.findAndCountAll({
      where: {
        AccountId: req.user.id,
      },
      include: [
        {
          model: Item,
          include: [
            Product,
            Location,
            {
              model: ItemImage,
              as: "itemimages",
            },
          ],
        },
      ],
      distinct: true,
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: favorites.rows,
      pagination: {
        page: Number(page) || 1,
        total: favorites.count,
      },
    });
  }),
  addToFavorite: asyncHandle(async (req, res, next) => {
    const { itemId } = req.body;

    const item = await Item.findByPk(itemId, {
      include: [
        Product,
        Location,
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
    });

    if (!item) {
      return next(new ErrorResponse(`Không tìm thấy sản phẩm này.`, 404));
    }

    const oldFavorite = await Favorite.findOne({
      where: {
        AccountId: req.user.id,
        ItemId: itemId,
      },
    });

    if (oldFavorite) {
      return next(
        new ErrorResponse(`Sản phẩm đã có trong danh sách yêu thích.`, 400)
      );
    }

    await Favorite.create({
      AccountId: req.user.id,
      ItemId: itemId,
    });

    return res.status(201).json({
      success: true,
      data: item,
    });
  }),
  deleteItem: asyncHandle(async (req, res, next) => {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      where: {
        AccountId: req.user.id,
        ItemId: id,
      },
    });

    if (!favorite) {
      return next(new ErrorResponse(`Không tìm thấy sản phẩm này`, 404));
    }

    if (favorite.AccountId !== req.user.id) {
      return next(
        new ErrorResponse(`Bạn không có quyền để thực hiện hành động này.`, 401)
      );
    }

    await favorite.destroy();

    return res.status(200).json({
      success: true,
      data: {},
    });
  }),
};
