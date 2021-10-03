"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Accounts", "rating", {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 1),
      defaultValue: 5,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Accounts", "rating");
  },
};
