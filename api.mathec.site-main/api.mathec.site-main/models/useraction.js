'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Question, {
        foreignKey: 'question_id',
      });
    }
  }
  UserAction.init(
    {
      user_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      type_judge: DataTypes.ENUM('like', 'dislike', 'saved', 'isview'),
    },
    {
      sequelize,
      modelName: 'UserAction',
    }
  );
  return UserAction;
};
