"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, {
        foreignKey: "productID",
        onDelete: "cascade",
      });

      this.belongsTo(models.Location, {
        foreignKey: "locationID",
        onDelete: "cascade",
      });

      this.hasMany(models.Item_image, {
        foreignKey: "ItemID",
        as: "item_images",
      });

      this.hasMany(models.Favorite, {
        foreignKey: "ItemID",
        as: "favorites",
      });
    }
  }
  Item.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter item name.",
          },
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter item code.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter item code.",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter item price.",
          },
          min: {
            args: 0,
            msg: "Please enter item price > 0.",
          },
        },
      },
      isSold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
