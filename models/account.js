"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Vote, {
        foreignKey: "accountID",
        as: "votes",
      });

      this.belongsTo(models.Vip, {
        foreignKey: "vipID",
        onDelete: "cascade",
      });

      this.hasMany(models.Favorite, {
        foreignKey: "accountID",
        as: "favorites",
      });
    }
  }
  Account.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your name.",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your phone.",
          },
          len: {
            args: [10, 11],
            msg: "Enter wrong length of phone.",
          },
        },
      },
      address: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your email.",
          },
          isEmail: {
            msg: "Enter wrong email format.",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your password.",
          },
          min: {
            args: 6,
            msg: "Your password enter shorter than 6 character.",
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter your gender.",
          },
          isIn: {
            args: [["male", "female", "other"]],
            msg: "Please enter your gender.",
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "local",
        validate: {
          notNull: {
            msg: "Please enter your type account.",
          },
          isIn: {
            args: [["local", "google", "facebook"]],
            msg: "Please enter your tyoe account.",
          },
        },
      },
      resetPasswordToken: DataTypes.STRING,
      resetPasswordExpire: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
