const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const KomponenGaji = sequelize.define(
  "komponen_gaji",
  {
    id_komponen_gaji: {
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
    komponen_gaji: {
      type: DataTypes.STRING,
    },
    jenis: {
      type: DataTypes.STRING,
    },
    kelompok_komponen: {
      type: DataTypes.STRING,
    },
    komponen: {
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
    tableName: "komponen_gaji",
  }
);

module.exports = { KomponenGaji };
