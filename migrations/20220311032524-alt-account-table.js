"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Accounts", "password", {
      type: Sequelize.STRING,
    });

    await queryInterface.changeColumn("Accounts", "gender", {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Accounts", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Accounts", "gender", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
