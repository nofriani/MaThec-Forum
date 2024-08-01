"use strict";
const { Model } = require("sequelize");
const Question = require("./question");
const Tag = require("./tag");
module.exports = (sequelize, DataTypes) => {
  class QuestionTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Tag, {
        foreignKey: "tag_id",
        as: "tag",
      });
      this.belongsTo(models.Question, {
        foreignKey: "question_id",
      });
    }
  }
  QuestionTag.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      question_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: Question,
          key: "id",
        },
      },
      tag_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: Tag,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "QuestionTag",
      tableName: "QuestionTags",
      underscored: true,
    }
  );
  return QuestionTag;
};
