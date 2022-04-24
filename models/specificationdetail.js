"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SpecificationDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Specification, {
        foreignKey: "SpecificationId",
        onDelete: "cascade",
      });
    }
  }
  SpecificationDetail.init(
    {
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Giá trị thông số là bắt buộc.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SpecificationDetail",
    }
  );
  return SpecificationDetail;
};
