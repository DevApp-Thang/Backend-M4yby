"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SearchHistory extends Model {
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
  SearchHistory.init(
    {
      keyword: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter keyword.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SearchHistory",
    }
  );
  return SearchHistory;
};
