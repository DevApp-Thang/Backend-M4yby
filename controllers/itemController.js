const crypto = require("crypto");
const path = require("path");
const asyncHandle = require("../middlewares/asyncHandle");
const { Item, Location, ItemImage, sequelize } = require("../models");
const ErrorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createItem: asyncHandle(async (req, res, next) => {
    const transaction = await sequelize.transaction();

    const { images } = req.files;
    const { long, lat, name, description, price, ProductId } = req.body;
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
          long,
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

          file.name = `${AccountId}${item.name}${index}${
            path.parse(file.name).ext
          }`;

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
};
