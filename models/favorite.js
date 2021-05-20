"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "accountID",
        onDelete: "cascade",
      });
      this.belongsTo(models.Item, {
        foreignKey: "itemID",
        onDelete: "cascade",
      });
    }
  }
  Favorite.init(null, {
    sequelize,
    modelName: "Favorite",
  });
  return Favorite;
};
