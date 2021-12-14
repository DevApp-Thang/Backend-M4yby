"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "ActorId",
        onDelete: "cascade",
      });
      this.belongsTo(models.Account, {
        foreignKey: "ReportableId",
        onDelete: "cascade",
      });
    }
  }

  Report.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Report",
    }
  );

  return Report;
};
