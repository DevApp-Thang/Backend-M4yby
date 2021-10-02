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
    await queryInterface.bulkInsert("TypeOfService", [
      {
        name: "Artistic disciplines",
      },
      {
        name: "Driving (Automatic transmission)",
      },
      {
        name: "Driving (Manual transmission)",
      },
      {
        name: "Child development",
      },
      {
        name: "Driving a motorcycle",
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
