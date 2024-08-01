'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Tag, {
        through: models.QuestionTag,
        as: 'tag',
        foreignKey: 'tag_id',
      });
      this.hasMany(models.QuestionTag, {
        foreignKey: 'tag_id',
        as: 'question_tag',
      });
    }
  }
  Tag.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'Tags',
      underscored: true,
    }
  );
  return Tag;
};
