const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const Jadwal = sequelize.define(
  "jadwal",
  {
    id_jadwal: {
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
    waktu_masuk: {
      type: DataTypes.TIME,
    },
    waktu_keluar: {
      type: DataTypes.TIME,
    },
    is_aktif: {
      type: DataTypes.INTEGER,
    },
    warna: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    tableName: "jadwal",
  }
);

module.exports = { Jadwal };
