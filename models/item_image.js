"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ItemImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ItemImage.init(
    {
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Nguồn ảnh là bắt buộc.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "ItemImage",
    }
  );
  return ItemImage;
};
