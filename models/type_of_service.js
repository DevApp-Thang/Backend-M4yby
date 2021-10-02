"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeOfService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Item, {
        foreignKey: "TypeOfServiceId",
        as: "items",
      });
    }
  }
  TypeOfService.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter type of service.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "TypeOfService",
    }
  );
  return TypeOfService;
};
