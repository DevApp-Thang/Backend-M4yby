"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Items", "allowToCall", {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    });
    await queryInterface.addColumn("Items", "timeCallFrom", {
      allowNull: true,
      type: Sequelize.DATE,
    });
    await queryInterface.addColumn("Items", "timeCallTo", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Items", "allowToCall");
    await queryInterface.removeColumn("Items", "timeCallFrom");
    await queryInterface.removeColumn("Items", "timeCallTo");
  },
};
