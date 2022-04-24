"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.SubCategory, {
        foreignKey: "SubcategoryId",
        onDelete: "cascade",
      });
      this.hasMany(models.Item, {
        foreignKey: "ProductId",
        as: "items",
      });
      this.hasMany(models.Specification, {
        foreignKey: "ProductId",
        as: "specifications",
      });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tên sản phẩm là bắt buộc.",
          },
        },
      },
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
