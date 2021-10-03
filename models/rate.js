"use strict";
const { Model } = require("sequelize");
const { Item } = require("./");

module.exports = (sequelize, DataTypes) => {
  class Rate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Account, {
        foreignKey: "sellerId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Account, {
        foreignKey: "voterId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Item, {
        foreignKey: "itemId",
        onDelete: "cascade",
      });
    }
  }
  Rate.init(
    {
      value: {
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
      hooks: {
        beforeCreate: async (vote, options) => {
          const item = await Item.findByPk(vote.itemId);
          const { count, rows } = await this.findAndCountAll({
            where: {
              itemId: vote.itemId,
            },
          });
        },
        beforeUpdate: async (vote, options) => {},
        beforeDestroy: async (vote, options) => {},
      },
      sequelize,
      modelName: "Rate",
    }
  );
  return Rate;
};
