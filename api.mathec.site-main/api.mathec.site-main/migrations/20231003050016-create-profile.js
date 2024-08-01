"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Profiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      profile_picture: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      about_me: {
        type: Sequelize.TEXT,
      },
      link: {
        type: Sequelize.STRING,
      },
      github_link: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint("Profiles", {
      type: "unique",
      fields: ["id"],
      name: "profiles_id_unique",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Profiles");
  },
};
