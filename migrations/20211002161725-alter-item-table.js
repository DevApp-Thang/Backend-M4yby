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
    await queryInterface.addColumn("Items", "rating", {
      allowNull: false,
      type: Sequelize.DECIMAL(10, 1),
      defaultValue: 5,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Items", "allowToCall");
    await queryInterface.removeColumn("Items", "timeCallFrom");
    await queryInterface.removeColumn("Items", "timeCallTo");
    await queryInterface.removeColumn("Items", "rating");
  },
};
