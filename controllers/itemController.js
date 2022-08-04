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
  Follow,
} = require("../models");
const ErrorResponse = require("../helpers/ErrorResponse");
const random = require("../helpers/random");
const EventEmitter = require("events");
const { pushNotification } = require("../helpers/firebase");

module.exports = {
  createItem: asyncHandle(async (req, res, next) => {
    const images = req?.files?.images;

    const {
      lng,
      lat,
      name,
      description,
      price,
      ProductId,
      allowToCall,
      timeCallFrom,
      timeCallTo,
      specifications,
      address,
    } = req.body;
    const AccountId = req.user.id;

    const followers = await Follow.findAll({
      where: {
        selfId: req.user.id,
      },
    });

    const followIds = followers.map((follower) => follower.FollowId);

    const users = await Account.findAll({
      where: {
        id: followIds,
      },
    });

    const message = {
      notification: {
        title: `${req.user.name} đã thêm 1 sản phẩm mới`,
        body: `${req.user.name} đã thêm 1 sản phẩm mới`,
      },
    };

    const tokenDevices = users
      .map((user) => user.tokenDevices)
      .join(",")
      .split(",")
      .filter((item) => item !== "");

    let status = false;
    let code;
    let item;

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
    const transaction = await sequelize.transaction();
    try {
      const location = await Location.create(
        {
          lng,
          lat,
        },
        { transaction }
      );

      item = await Item.create(
        {
          name,
          description,
          price,
          code,
          AccountId,
          ProductId,
          LocationId: location.id,
          rating: 5,
          allowToCall,
          timeCallFrom,
          timeCallTo,
          specifications,
          address,
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

          if (file.size > process.env.MAX_SIZE_UPLOAD) {
            continue;
          }

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
        return next(new ErrorResponse(`Lỗi tải ảnh.`, 400));
      }

      if (fileSuccess) {
        await ItemImage.bulkCreate(fileSuccess, { transaction });
      }

      await transaction.commit();
      await item.reload({ include: [Product, Location, "itemimages"] });

      return res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      await transaction.rollback();
      return next(new ErrorResponse(err.message, 400));
    } finally {
      const ee = new EventEmitter();
      ee.on("create-item", function (message) {
        pushNotification(message, tokenDevices);
      });
      ee.emit("create-item", message);
    }
  }),

  updateItem: asyncHandle(async (req, res, next) => {
    const {
      lng,
      lat,
      name,
      description,
      price,
      ProductId,
      isSold,
      specifications,
      address,
    } = req.body;
    const AccountId = req.user.id;
    const { itemID } = req.params;

    const item = await Item.findByPk(itemID);

    if (!item) {
      return next(new ErrorResponse(`Sản phẩm không tồn tại.`, 404));
    }

    if (AccountId !== item.AccountId) {
      return next(
        new ErrorResponse(`Bạn không có quyền để thực hiện hành động này.`, 401)
      );
    }

    const { LocationId, id, code } = item;

    const transaction = await sequelize.transaction();

    try {
      const location = await Location.findByPk(LocationId);
      await location.update({ lng, lat }, { transaction });

      const fileSuccess = [];

      if (req.files["images"]) {
        const { images } = req.files;
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

      if (req.files["images"] && !fileSuccess) {
        await transaction.rollback();
        return next(new ErrorResponse(`Lỗi tải ảnh.`, 400));
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
            specifications,
            address,
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
            specifications,
            address,
          },
          {
            transaction,
          }
        );
      }

      await transaction.commit();
      await item.reload({ include: [Product, Location, "itemimages"] });

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
        return next(new ErrorResponse(`Sản phẩm không tồn tại.`, 404));
      }
      const { LocationId, id, AccountId, code } = item;

      if (AccountId !== req.user.id) {
        return next(
          new ErrorResponse(
            `Bạn không có quyền để thực hiện hành động này.`,
            401
          )
        );
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
      sort,
    } = req.query;
    let { page } = req.query;
    let query = {};

    let location;

    if (lng && lat && distance) {
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
          [Op.gte]: new Date(timeFrom + " 00:00:00 UTC+0"),
        },
      };
    }

    if (timeTo) {
      query = {
        ...query,
        createdAt: {
          ...query.createdAt,
          [Op.lte]: new Date(timeTo + " 23:59:59 UTC+0"),
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

    let sortArray = [];
    if (sort) {
      const sortBy = sort.split(",");
      sortBy.forEach((field) => {
        let direction = field.startsWith("-") ? "DESC" : "ASC";

        if (~field.indexOf("price")) {
          sortArray.push(["price", direction]);
        }

        if (~field.indexOf("time")) {
          sortArray.push(["createdAt", direction]);
        }

        if (~field.indexOf("product")) {
          sortArray.push(["Product", "name", direction]);
        }

        if (~field.indexOf("distance") && lng && lat) {
          sortArray.push([sequelize.col("distance"), direction]);
        }
      });
    }

    const limitPerPage = Number(limit) || 10;

    const items = await Item.findAndCountAll({
      where: query,
      attributes: {
        include: [
          lat && lng
            ? [
                sequelize.literal(
                  `(SELECT (6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(${lng}) - radians(lng)) + sin(radians(${lat})) * sin(radians(lat)))) FROM Locations WHERE id = LocationId)`
                ),
                "distance",
              ]
            : null,
        ],
      },
      include: [
        Product,
        Location,
        {
          model: ItemImage,
          as: "itemimages",
        },
      ],
      distinct: true,
      offset: (Number(page) - 1) * limitPerPage,
      limit: limitPerPage,
      order: sortArray.length ? sortArray : [["id", "DESC"]],
      // order: [["id", "DESC"]],
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
      return next(new ErrorResponse("ID sản phẩm phải là số.", 400));
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
      return next(new ErrorResponse(`Sản phẩm không tồn tại.`, 404));
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

    let increView = 1;
    if (item.view < 1000) {
      increView = random(1, 9);
    }

    await item.increment("view", { by: increView });

    const like = await Favorite.count({ where: { ItemId: itemID } });

    const follow = await Follow.findOne({
      where: { SelfId: item.Account.id, FollowId: req.user.id },
    });

    const dataResponse = {
      ...item.dataValues,
      Account: {
        ...item.dataValues.Account.dataValues,
        isFollow: !follow ? false : true,
      },
      specifications: item.specifications,
      isFavorite,
      like,
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
      include: [Product, Location, "itemimages"],
    });

    if (!item) {
      return next(new ErrorResponse(`Sản phẩm không tồn tại.`, 404));
    }

    if (item.AccountId !== req.user.id) {
      return next(
        new ErrorResponse(`Bạn không có quyền để thực hiện hành động này.`, 401)
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
      include: [Product, Location, "itemimages"],
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
        Product,
        Location,
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
