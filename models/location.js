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
      lng: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Kinh độ là bắt buộc.",
          },
        },
      },
      lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isNumeric: {
            msg: "Vĩ độ là bắt buộc.",
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
