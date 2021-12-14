"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Follows", {
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
      SelfId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Accounts",
          key: "id",
          as: "SelfId",
        },
      },
      FollowID: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Accounts",
          key: "id",
          as: "FollowId",
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Follows");
  },
};
