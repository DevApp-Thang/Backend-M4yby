"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Item, {
        foreignKey: "LocationId",
        as: "items",
      });
    }
  }
  Location.init(
    {
      long: DataTypes.FLOAT,
      lat: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Location",
    }
  );
  return Location;
};
