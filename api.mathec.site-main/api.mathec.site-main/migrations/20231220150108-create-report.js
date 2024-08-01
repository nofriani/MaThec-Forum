'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jenis_laporan: {
        type: Sequelize.STRING,
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      bukti_laporan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pelapor_id: {
        type: Sequelize.INTEGER,
      },
      terlapor_id: {
        type: Sequelize.INTEGER,
      },
      question_id: {
        type: Sequelize.INTEGER,
      },
      answer_id: {
        type: Sequelize.INTEGER,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reports');
  },
};
