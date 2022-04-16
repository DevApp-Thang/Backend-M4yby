"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Accounts", "email", {
      type: Sequelize.STRING,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Accounts", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  },
};
