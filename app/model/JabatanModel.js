const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client, Unit } = require("./index");

const Jabatan = sequelize.define(
  "jabatan",
  {
    id_jabatan: {
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
    id_unit: {
      type: DataTypes.INTEGER,
      references: {
        model: Unit,
        key: "id_unit",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    nama_jabatan: {
      type: DataTypes.STRING,
    },
    membawahi_jabatan: {
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
    tableName: "jabatan",
  }
);

module.exports = { Jabatan };
