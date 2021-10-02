"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "Rates",
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          value: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          description: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          sellerId: {
            type: Sequelize.INTEGER,
            onDelete: "CASCADE",
            references: {
              model: "Accounts",
              key: "id",
              as: "sellerId",
            },
          },
          voterId: {
            type: Sequelize.INTEGER,
            onDelete: "CASCADE",
            references: {
              model: "Accounts",
              key: "id",
              as: "voterId",
            },
          },
          itemId: {
            type: Sequelize.INTEGER,
            onDelete: "CASCADE",
            references: {
              model: "Items",
              key: "id",
              as: "itemId",
            },
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );

      await queryInterface.dropTable("Votes", { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Rates");
  },
};
