const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const { Client, Pegawai, Users } = require("./index");

const UserMapping = sequelize.define(
  "user_mapping",
  {
    id_user_mapping: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    jenis_mapping: {
      type: DataTypes.STRING,
    },
    id_user: {
      type: DataTypes.INTEGER,
      references: {
        model: Users,
        key: "id",
      },
    },
    id_mapping: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "user_mapping",
  }
);

module.exports = {
  UserMapping,
};
