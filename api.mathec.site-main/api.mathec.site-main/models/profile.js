"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.User, { foreignKey: "profile_id" });
    }
  }
  Profile.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      profile_picture: DataTypes.STRING,
      address: DataTypes.TEXT,
      about_me: DataTypes.TEXT,
      link: DataTypes.STRING,
      github_link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "Profiles",
      underscored: true,
    }
  );
  return Profile;
};
