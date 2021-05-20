"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sub_category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: "categoryID",
        onDelete: "cascade",
      });
      this.hasMany(models.Product, {
        foreignKey: "subCategoryID",
        as: "products",
      });
    }
  }
  Sub_category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter sub category name.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Sub_category",
    }
  );
  return Sub_category;
};
