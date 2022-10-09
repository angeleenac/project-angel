const { Sequelize, DataTypes, Deferrable } = require("sequelize");
const sequilize = require("../config/db");
const { Client } = require("./index");

const Cabang = sequilize.define(
  "cabang",
  {
    id_cabang: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_cabang: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.STRING,
    },
    kontak: {
      type: DataTypes.STRING,
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
    id_client: {
      type: DataTypes.INTEGER,
      references: {
        model: Client,
        key: "id_client",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
    tableName: "cabang",
  }
);

module.exports = { Cabang };
