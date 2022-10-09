const { Sequelize, DataTypes, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const JenisCuti = sequelize.define(
  "jenis_cuti",
  {
    id_jenis_cuti: {
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
    jenis_cuti: {
      type: DataTypes.STRING,
    },
    saldo: {
      type: DataTypes.INTEGER,
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
    tableName: "jenis_cuti",
  }
);

module.exports = { JenisCuti };
