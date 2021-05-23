"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Account, {
        foreignKey: "VipId",
        as: "accounts",
      });
    }
  }
  Vip.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Vip",
    }
  );
  return Vip;
};
