"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Favorites", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      accountID: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Accounts",
          key: "id",
          as: "accountID",
        },
      },
      productID: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "products",
          key: "id",
          as: "productID",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Favorites");
  },
};
