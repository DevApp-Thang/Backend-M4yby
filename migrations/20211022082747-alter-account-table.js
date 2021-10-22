"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Accounts", "otpCode", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Accounts", "otpCodeExpired", {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.removeColumn("Accounts", "resetPasswordToken");
    await queryInterface.removeColumn("Accounts", "resetPasswordExpire");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Accounts", "otpCode");
    await queryInterface.removeColumn("Accounts", "otpCodeExpired");
    await queryInterface.addColumn("Accounts", "resetPasswordToken", {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Accounts", "resetPasswordExpire", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
};
