"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "SelfId",
        onDelete: "cascade",
      });
      this.belongsTo(models.Account, {
        foreignKey: "FollowId",
        onDelete: "cascade",
      });
    }
  }

  Follow.init(null, {
    sequelize,
    modelName: "Follow",
  });

  return Follow;
};
