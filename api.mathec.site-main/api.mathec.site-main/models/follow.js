'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Follow.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      follower_id: DataTypes.INTEGER,
      following_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Follow',
      tableName: 'Follows',
      underscored: true,
    }
  );
  return Follow;
};
