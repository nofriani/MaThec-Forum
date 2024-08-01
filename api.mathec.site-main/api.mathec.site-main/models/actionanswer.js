'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActionAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ActionAnswer.init(
    {
      user_id: DataTypes.INTEGER,
      answer_id: DataTypes.INTEGER,
      type: DataTypes.ENUM('like', 'dislike'),
    },
    {
      sequelize,
      modelName: 'ActionAnswer',
      tableName: 'ActionAnswers',
      underscored: true,
    }
  );
  return ActionAnswer;
};
