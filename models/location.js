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
      long: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Please enter a number for long.",
          },
        },
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Please enter a number for lat.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Location",
    }
  );
  return Location;
};
