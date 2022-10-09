const { Sequelize, DataTypes, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client, Cabang } = require("./index");

const Unit = sequelize.define(
  "unit",
  {
    id_unit: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_client: {
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: "id_client",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    id_cabang: {
      type: DataTypes.INTEGER,
      references: {
        model: Cabang,
        key: "id_cabang",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    nama_unit: {
      type: DataTypes.STRING,
    },
    membawahi_unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_parent: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_aktif: {
      type: DataTypes.INTEGER,
    },
    user_create: {
      type: DataTypes.INTEGER,
    },
    user_update: {
      type: DataTypes.INTEGER,
    },
    time_create: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
    },
    time_update: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "unit",
  }
);

module.exports = { Unit };
