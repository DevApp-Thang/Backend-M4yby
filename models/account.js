"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PROTECTED_ATTRIBUTES = ["password"];

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    toJSON() {
      // hide protected fields
      const attributes = { ...this.get() };
      // eslint-disable-next-line no-restricted-syntax
      for (const value of PROTECTED_ATTRIBUTES) {
        delete attributes[value];
      }
      return attributes;
    }

    async matchPassword(enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    }

    getSignedJwtToken() {
      return jwt.sign({ id: this.id }, process.env.SECRET_TOKEN, {
        expiresIn: process.env.TOKEN_EXPIRE,
      });
    }

    getSignedJwtRefreshToken() {
      return jwt.sign({ id: this.id }, process.env.SECRET_REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      });
    }

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
        unique: true,
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
        unique: true,
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
      hooks: {
        beforeCreate: async (account, options) => {
          const salt = await bcrypt.genSalt(10);
          account.password = await bcrypt.hash(account.password, salt);
        },
      },
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
