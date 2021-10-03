const crypto = require("crypto");
const path = require("path");
const fs = require("fs/promises");
const { Op } = require("sequelize");
const asyncHandle = require("../middlewares/asyncHandle");
const {
  Item,
  Location,
  ItemImage,
  SearchHistory,
  sequelize,
  Account,
  Product,
  Favorite,
} = require("../models");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createItem: asyncHandle(async (req, res, next) => {
    const transaction = await sequelize.transaction();

    const { images } = req.files;
    const { lng, lat, name, description, price, ProductId } = req.body;
    const AccountId = req.user.id;

    let status = false;
    let code;

    while (!status) {
      code = crypto.randomBytes(4).toString("hex");
      const item = await Item.findOne({
        where: {
          code,
        },
      });
      if (!item) {
        status = true;
      }
    }
    try {
      const location = await Location.create(
        {
          lng,
          lat,
        },
        { transaction }
      );

      const item = await Item.create(
        {
          name,
          description,
          price,
          code,
          AccountId,
          ProductId,
          LocationId: location.id,
        },
        {
          transaction,
        }
      );

      const fileSuccess = [];

      if (images) {
        for (let index = 0; index < images.length; index++) {
          const file = images[index];

          if (!file.mimetype.startsWith("image")) {
            continue;
          }

          // if(file.size > process.env.MAX_SIZE_UPLOAD){
          //   continue;
          // }

          file.name = `${AccountId}${code}${index}${path.parse(file.name).ext}`;

          file.mv(`${process.env.FOLDER_DEFAULT}/${file.name}`, async (err) => {
            if (err) {
              console.log(`Error upload image ${index}: ${err}`);
              this.continue;
            }
          });

          const imageUrl = `${req.protocol}://${req.get("host")}/images/${
            file.name
          }`;

          fileSuccess.push({ source: imageUrl, ItemId: item.id });
        }
      }

      if (images && !fileSuccess) {
        await transaction.rollback();
        return next(new ErrorResponse(`Error when upload image.`, 400));
      }

      if (fileSuccess) {
        await ItemImage.bulkCreate(fileSuccess, { transaction });
      }

      await transaction.commit();

      return res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      await transaction.rollback();
      return next(new ErrorResponse(err.message, 400));
    }
  }),

  updateItem: asyncHandle(async (req, res, next) => {
    const { images } = req.files;
    const { lng, lat, name, description, price, ProductId, isSold } = req.body;
    const AccountId = req.user.id;
    const { itemID } = req.params;

    const item = await Item.findByPk(itemID);

    if (!item) {
      return next(
        new ErrorResponse(`Cannot find item with id ${itemID}.`, 404)
      );
    }

    if (AccountId !== item.AccountId) {
      return next(new ErrorResponse(`You do not have access.`, 401));
    }

    const { LocationId, id, code } = item;

    const transaction = await sequelize.transaction();

    try {
      const location = await Location.findByPk(LocationId);
      await location.update({ lng, lat }, { transaction });

      const fileSuccess = [];

      if (images) {
        for (let index = 0; index < images.length; index++) {
          const file = images[index];

          if (!file.mimetype.startsWith("image")) {
            continue;
          }

          // if(file.size > process.env.MAX_SIZE_UPLOAD){
          //   continue;
          // }

          file.name = `${AccountId}${code}${index}${path.parse(file.name).ext}`;

          file.mv(`${process.env.FOLDER_DEFAULT}/${file.name}`, async (err) => {
            if (err) {
              console.log(`Error upload image ${index}: ${err}`);
              this.continue;
            }
          });

          const imageUrl = `${req.protocol}://${req.get("host")}/images/${
            file.name
          }`;

          fileSuccess.push({ source: imageUrl, ItemId: id });
        }
      }

      if (images && !fileSuccess) {
        await transaction.rollback();
        return next(new ErrorResponse(`Error when upload image.`, 400));
      }

      const itemImages = await ItemImage.findAll({
        where: {
          ItemId: id,
        },
      });

      if (itemImages) {
        for (let index = 0; index < itemImages.length; index++) {
          const image = itemImages[index];

          await image.destroy({ transaction });
        }
        await ItemImage.bulkCreate(fileSuccess, { transaction });
      }

      if (isSold !== undefined) {
        await item.update(
          {
            name,
            description,
            price,
            ProductId,
            isSold,
          },
          {
            transaction,
          }
        );
      } else {
        await item.update(
          {
            name,
            description,
            price,
            ProductId,
          },
          {
            transaction,
          }
        );
      }

      await transaction.commit();

      return res.status(200).json({
        success: true,
        data: item,
      });
    } catch (err) {
      await transaction.rollback();
      return next(new ErrorResponse(err.message, 400));
    }
  }),

  deleteItem: asyncHandle(async (req, res, next) => {
    const { itemID } = req.params;
    const transaction = await sequelize.transaction();

    try {
      const item = await Item.findByPk(itemID);

      if (!item) {
        return next(
          new ErrorResponse(`Cannot find item with ID ${itemID}.`, 404)
        );
      }
      const { LocationId, id, AccountId, code } = item;

      if (AccountId !== req.user.id) {
        return next(new ErrorResponse(`You do not have access.`, 401));
      }

      await item.destroy({ transaction });

      const location = await Location.findByPk(LocationId);

      await location.destroy({ transaction });

      const itemImages = await ItemImage.findAll({
        where: {
          ItemId: id,
        },
      });

      if (itemImages) {
        for (let index = 0; index < itemImages.length; index++) {
          const image = itemImages[index];

          await image.destroy({ transaction });

          const listImage = await fs.readdir("public/images");
          for (const file of listImage) {
            if (file.indexOf(code)) {
              await fs.unlink(`public/images/${file}`);
            }
          }
        }
      }

      await transaction.commit();

      return res.status(200).json({
        success: true,
        data: {},
      });
    } catch (err) {
      console.log(err.message);
      await transaction.rollback();
      return next(new ErrorResponse(err.message, 400));
    }
  }),

  searchItem: asyncHandle(async (req, res, next) => {
    const {
      lng,
      lat,
      distance,
      ProductId,
      priceFrom,
      priceTo,
      name,
      timeFrom,
      timeTo,
      isSold,
      limit,
    } = req.query;
    let { page } = req.query;
    let query = {};

    let location;

    if (lng && lat) {
      location = await Location.findAll({
        attributes: ["id"],
        where: sequelize.where(
          sequelize.literal(
            `6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(${lng}) - radians(lng)) + sin(radians(${lat})) * sin(radians(lat)))`
          ),
          "<=",
          distance
        ),
      });
    }

    if (location) {
      const lctID = location.map((lct) => lct.id);
      query = {
        ...query,
        LocationId: {
          [Op.in]: lctID,
        },
      };
    }

    if (ProductId) {
      query = {
        ...query,
        ProductId,
      };
    }

    if (priceFrom) {
      query = {
        ...query,
        price: {
          [Op.gte]: priceFrom,
        },
      };
    }

    if (priceTo) {
      query = {
        ...query,
        price: {
          [Op.lte]: priceTo,
        },
      };
    }

    if (timeFrom) {
      query = {
        ...query,
        createdAt: {
          [Op.gte]: timeFrom + " 00:00:00",
        },
      };
    }

    if (timeTo) {
      query = {
        ...query,
        createdAt: {
          [Op.lte]: timeTo + " 23:59:59",
        },
      };
    }

    switch (isSold) {
      case "true":
        query = {
          ...query,
          isSold: true,
        };
        break;
      case "false":
        query = {
          ...query,
          isSold: false,
        };
        break;
      default:
        break;
    }

    if (name) {
      query = {
        ...query,
        name: {
          [Op.like]: `%${name}%`,
        },
      };

      const keyword = await SearchHistory.findOne({
        where: {
          keyword: { [Op.like]: `%${name}%` },
          AccountId: req.user.id,
        },
      });
      if (!keyword) {
        await SearchHistory.create({
          keyword: name,
          AccountId: req.user.id,
        });
      }
    }

    if (!page) {
      page = 1;
    }

    const limitPerPage = Number(limit) || 10;

    const items = await Item.findAndCountAll({
      where: query,
      include: [
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
      distinct: true,
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: items.rows,
      pagination: {
        page: Number(page) || 1,
        total: items.count,
      },
    });
  }),

  getItemDetail: asyncHandle(async (req, res, next) => {
    const { itemID } = req.params;

    if (isNaN(Number(itemID))) {
      return next(new ErrorResponse("Id must be a number", 400));
    }

    const item = await Item.findOne({
      where: {
        id: itemID,
      },
      include: [
        Account,
        Location,
        Product,
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
    });

    if (!item) {
      return next(new ErrorResponse(`Cannot find item with id ${itemID}`, 404));
    }

    const favorite = await Favorite.findOne({
      where: {
        ItemId: itemID,
        AccountId: req.user.id,
      },
    });

    let isFavorite = true;
    if (!favorite) {
      isFavorite = false;
    }

    const dataResponse = {
      ...item.dataValues,
      isFavorite,
    };

    return res.status(200).json({
      success: true,
      data: dataResponse,
    });
  }),

  updateStatusItem: asyncHandle(async (req, res, next) => {
    const { itemID } = req.params;
    const { isSold } = req.body;

    const item = await Item.findOne({
      where: {
        id: itemID,
      },
    });

    if (!item) {
      return next(
        new ErrorResponse(`Cannot find item with id ${itemID}.`, 404)
      );
    }

    if (item.AccountId !== req.user.id) {
      return next(
        new ErrorResponse(`You don't have item with id ${itemID}.`, 401)
      );
    }

    await item.update({
      isSold,
    });

    return res.status(200).json({
      success: true,
      data: item,
    });
  }),

  getSoldItems: asyncHandle(async (req, res, next) => {
    const { name } = req.query;
    let { page, limit } = req.query;
    let query = {
      AccountId: req.user.id,
      isSold: true,
    };

    if (name) {
      query = {
        ...query,
        name: {
          [Op.like]: `%${name}%`,
        },
      };
    }

    if (!page) {
      page = 1;
    }

    const limitPerPage = Number(limit) || 10;

    const items = await Item.findAndCountAll({
      where: query,
      include: [
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
      distinct: true,
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: items.rows,
      pagination: {
        page: Number(page) || 1,
        total: items.count,
      },
    });
  }),

  getItemsByMe: asyncHandle(async (req, res, next) => {
    const { name } = req.query;
    let { page, limit } = req.query;
    let query = {
      AccountId: req.user.id,
    };

    if (name) {
      query = {
        ...query,
        name: {
          [Op.like]: `%${name}%`,
        },
      };
    }

    if (!page) {
      page = 1;
    }

    const limitPerPage = Number(limit) || 10;

    const items = await Item.findAndCountAll({
      where: query,
      include: [
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
      distinct: true,
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: items.rows,
      pagination: {
        page: Number(page) || 1,
        total: items.count,
      },
    });
  }),
};
