"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "sellerId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Account, {
        foreignKey: "voterId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Item, {
        foreignKey: "itemId",
        onDelete: "cascade",
      });
    }
  }
  Rate.init(
    {
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: [1, 5],
            msg: "Đánh giá phải từ 1 đến 5.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Rate",
    }
  );
  return Rate;
};
