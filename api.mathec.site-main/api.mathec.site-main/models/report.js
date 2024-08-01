'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'pelapor_id',
        as: 'pelapor',
      });
      this.belongsTo(models.User, {
        foreignKey: 'terlapor_id',
        as: 'terlapor',
      });
      this.belongsTo(models.Question, {
        foreignKey: 'question_id',
        as: 'question',
      });
      this.belongsTo(models.QuestionAnswer, {
        foreignKey: 'answer_id',
        as: 'answer',
      });
    }
  }
  Report.init(
    {
      jenis_laporan: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      bukti_laporan: DataTypes.STRING,
      pelapor_id: DataTypes.INTEGER,
      terlapor_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      answer_id: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Report',
      tableName: 'Reports',
      underscored: true,
    }
  );
  return Report;
};
