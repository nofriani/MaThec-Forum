"use strict";
const { Model } = require("sequelize");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.belongsToMany(models.Tag, {
        through: models.QuestionTag,
        as: "tag",
        foreignKey: "question_id",
      });
      this.hasMany(models.QuestionAnswer, {
        foreignKey: "question_id",
      });
      this.hasMany(models.UserAction, {
        foreignKey: "question_id",
      });
    }
  }
  Question.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
      },
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      like: DataTypes.INTEGER,
      dislike: DataTypes.INTEGER,
      view_count: DataTypes.INTEGER,
      vote_count: DataTypes.INTEGER,
      deleted_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Question",
      tableName: "Questions",
      underscored: true,
      paranoid: true,
    },
  );
  return Question;
};
