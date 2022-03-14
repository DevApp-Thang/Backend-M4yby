"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PlaceOfRendering extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  PlaceOfRendering.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter place of rendering.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "PlaceOfRendering",
    }
  );
  return PlaceOfRendering;
};
