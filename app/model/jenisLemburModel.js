const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const JenisLembur = sequelize.define(
  "jenis_lembur",
  {
    id_jenis_lembur: {
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
    jenis_lembur: {
      type: DataTypes.STRING,
    },
    jenis_jadwal: {
      type: DataTypes.STRING,
    },
    jenis_perhitungan: {
      type: DataTypes.STRING,
    },
    formula: {
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
  },
  {
    timestamps: false,
    tableName: "jenis_lembur",
  }
);

module.exports = { JenisLembur };
