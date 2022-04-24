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

      this.hasMany(models.Rate, {
        foreignKey: "itemId",
        as: "rates",
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
            msg: "Tên sản phẩm là bắt buộc.",
          },
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Code sản phẩm là bắt buộc.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Mô tả sản phẩm là bắt buộc.",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Giá sản phẩm là bắt buộc.",
          },
          isInt: {
            msg: "Giá sản phẩm phải là số.",
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
        type: DataTypes.STRING,
      },
      timeCallTo: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: false,
        validate: {
          len: {
            args: [1, 5],
            msg: "Đánh giá phải từ 1 đến 5.",
          },
        },
      },
      specifications: {
        type: DataTypes.JSON,
        validate: {
          isJSON(value) {
            try {
              JSON.parse(value);
            } catch (error) {
              throw new Error("Thông số sản phẩm phải là JSON");
            }
          },
        },
        get: function () {
          return JSON.parse(this.getDataValue("specifications"));
        },
      },
      view: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Địa chỉ là bắt buộc.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
