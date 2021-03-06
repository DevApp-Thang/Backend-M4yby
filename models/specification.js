"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Specification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "ProductId",
        onDelete: "cascade",
      });

      this.hasMany(models.SpecificationDetail, {
        foreignKey: "SpecificationId",
        as: "specificationDetails",
      });
    }
  }

  Specification.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tên thông số là bắt buộc.",
          },
        },
      },
      category: {
        type: DataTypes.STRING,
        defaultValue: "custom",
        validate: {
          isIn: {
            args: [["custom", "optional", "require"]],
            msg: "Không hỗ trợ loại thông số này.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Specification",
    }
  );
  return Specification;
};
