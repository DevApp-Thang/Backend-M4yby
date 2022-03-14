"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PriceIndicated extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  PriceIndicated.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter price indicated name.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "PriceIndicated",
    }
  );
  return PriceIndicated;
};
