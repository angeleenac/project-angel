const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const Langganan = sequelize.define(
  "langganan",
  {
    id_langganan: {
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
    waktu_mulai: {
      type: DataTypes.DATEONLY,
    },
    waktu_selesai: {
      type: DataTypes.DATEONLY,
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
    tableName: "langganan",
  }
);

module.exports = { Langganan };
