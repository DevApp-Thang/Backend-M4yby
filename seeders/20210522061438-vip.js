"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Vips", [
      {
        name: "VIP0",
      },
      {
        name: "VIP1",
      },
      {
        name: "VIP2",
      },
      {
        name: "VIP3",
      },
      {
        name: "VIP4",
      },
      {
        name: "VIP5",
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
