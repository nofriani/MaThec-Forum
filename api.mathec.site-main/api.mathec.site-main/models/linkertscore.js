"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LinkertScore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "id_user",
        as: "user",
      });
    }
  }
  LinkertScore.init(
    {
      id_user: DataTypes.INTEGER,
      id_questioner: DataTypes.INTEGER,
      score: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "LinkertScore",
      tableName: "LinkertScores",
      underscored: true,
    },
  );
  return LinkertScore;
};
