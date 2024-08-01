'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryQuestioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Questioner, {
        foreignKey: 'id_category_questioner',
      });
    }
  }
  CategoryQuestioner.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'CategoryQuestioner',
      tableName: 'CategoryQuestioners',
      underscored: true,
    }
  );
  return CategoryQuestioner;
};
