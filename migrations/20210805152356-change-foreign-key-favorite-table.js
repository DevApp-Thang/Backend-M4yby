"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("Favorites", "ProductId", {
        transaction,
      });
      await queryInterface.addColumn(
        "Favorites",
        "ItemId",
        {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "Items",
            key: "id",
            as: "ItemId",
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Favorites", "ItemId");
  },
};
