"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "AccountId",
        onDelete: "cascade",
      });
    }
  }
  Vote.init(
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
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Vote",
    }
  );
  return Vote;
};
