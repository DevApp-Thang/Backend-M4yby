"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Items", "timeCallFrom", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn("Items", "timeCallTo", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Items", "timeCallFrom", {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.changeColumn("Items", "timeCallTo", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
};
