"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("QuestionTags", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      question_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Questions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tag_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: "Tags",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.addConstraint("QuestionTags", {
      type: "foreign key",
      fields: ["question_id"],
      name: "question_tags_question_id_fkey",
      references: {
        table: "Questions",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("QuestionTags", {
      type: "foreign key",
      fields: ["tag_id"],
      name: "question_tags_tag_id_fkey",
      references: {
        table: "Tags",
        field: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addConstraint("QuestionTags", {
      type: "unique",
      fields: ["id"],
      name: "question_tags_id_unique",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("QuestionTags");
  },
};
