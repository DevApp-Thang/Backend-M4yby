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
        foreignKey: "ProductId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Location, {
        foreignKey: "LocationId",
        onDelete: "cascade",
      });

      this.belongsTo(models.Account, {
        foreignKey: "AccountId",
        onDelete: "cascade",
      });

      this.belongsTo(models.PlaceOfRendering, {
        foreignKey: "PlaceOfRenderingId",
        onDelete: "cascade",
      });

      this.belongsTo(models.PriceIndicated, {
        foreignKey: "PriceIndicatedId",
        onDelete: "cascade",
      });

      this.belongsTo(models.TypeOfService, {
        foreignKey: "TypeOfServiceId",
        onDelete: "cascade",
      });

      this.hasMany(models.ItemImage, {
        foreignKey: "ItemId",
        as: "itemimages",
      });

      this.hasMany(models.Favorite, {
        foreignKey: "ItemId",
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
          isInt: {
            msg: "Please enter the number of price.",
          },
        },
      },
      isSold: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      allowToCall: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      timeCallFrom: {
        type: DataTypes.DATE,
      },
      timeCallTo: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
