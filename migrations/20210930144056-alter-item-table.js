"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "Items",
        "TypeOfServiceId",
        {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "TypeOfService",
            key: "id",
            as: "TypeOfServiceId",
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Items",
        "PriceIndicatedId",
        {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "PriceIndicated",
            key: "id",
            as: "PriceIndicatedId",
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        "Items",
        "PlaceOfRenderingId",
        {
          type: Sequelize.INTEGER,
          onDelete: "CASCADE",
          references: {
            model: "PlaceOfRendering",
            key: "id",
            as: "PlaceOfRenderingId",
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
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("Items", "TypeOfServiceId", {
        transaction,
      });
      await queryInterface.removeColumn("Items", "PriceIndicatedId", {
        transaction,
      });
      await queryInterface.removeColumn("Items", "PlaceOfRenderingId", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }
  },
};
