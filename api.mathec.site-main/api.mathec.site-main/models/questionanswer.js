"use strict";
const { Model } = require("sequelize");
const Question = require("./question");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  class QuestionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Question, {
        foreignKey: "question_id",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  QuestionAnswer.init(
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
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      accepted: DataTypes.BOOLEAN,
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      vote_count: DataTypes.INTEGER,
      like_count: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "QuestionAnswer",
      tableName: "QuestionAnswers",
      underscored: true,
      paranoid: true,
    },
  );
  return QuestionAnswer;
};
