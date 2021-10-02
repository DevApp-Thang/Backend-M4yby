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
      // define association here
    }
  }
  Rate.init(
    {
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: [1, 5],
            msg: "Please enter rating from 1 to 5.",
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
