"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Specifications", "category", {
      type: Sequelize.STRING,
      defaultValue: "custom",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Specifications", "category");
  },
};
