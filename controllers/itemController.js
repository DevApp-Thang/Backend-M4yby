const crypto = require("crypto");
const path = require("path");
const fs = require("fs/promises");
const fss = require("fs");
const asyncHandle = require("../middlewares/asyncHandle");
const { Item, Location, ItemImage, sequelize } = require("../models");
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

      res.status(201).json({
        success: true,
        data: item,
      });
    } catch (err) {
      await transaction.rollback();
      return next(new ErrorResponse(err.message, 400));
    }
  }),

  updateItem: asyncHandle(async (req, res, next) => {
    const transaction = await sequelize.transaction();

    const { images } = req.files;
    const { lng, lat, name, description, price, ProductId } = req.body;
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

      await item.update(
        {
          name,
          description,
          price,
        },
        {
          transaction,
        }
      );

      await transaction.commit();

      res.status(200).json({
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

      res.status(200).json({
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
    const { lng, lat, distance } = req.query;

    const location = await Location.findAll({
      where: sequelize.where(
        sequelize.literal(
          `6371 * acos(cos(radians(${lat})) * cos(radians(lat)) * cos(radians(${lng}) - radians(lng)) + sin(radians(${lat})) * sin(radians(lat)))`
        ),
        "<=",
        distance
      ),
    });

    res.status(200).json({
      success: true,
      data: location,
    });
  }),
};
