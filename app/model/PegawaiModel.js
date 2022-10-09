const { Sequelize, DataTypes, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Client } = require("./index");

const Pegawai = sequelize.define(
  "pegawai",
  {
    id_pegawai: {
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
    id_absensi: {
      type: DataTypes.STRING,
    },
    jenis_identitas: {
      type: DataTypes.STRING,
    },
    no_identitas: {
      type: DataTypes.STRING,
    },
    nama_lengkap: {
      type: DataTypes.STRING,
    },
    jenis_kelamin: {
      type: DataTypes.STRING,
    },
    tempat_lahir: {
      type: DataTypes.STRING,
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
    },
    status_perkawinan: {
      type: DataTypes.STRING,
    },
    agama: {
      type: DataTypes.STRING,
    },
    pendidikan: {
      type: DataTypes.STRING,
    },
    alamat_domisili: {
      type: DataTypes.TEXT,
    },
    alamat_ktp: {
      type: DataTypes.TEXT,
    },
    no_kontak1: {
      type: DataTypes.STRING,
    },
    no_kontak2: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    no_pegawai: {
      type: DataTypes.STRING,
    },
    tanggal_masuk: {
      type: DataTypes.DATEONLY,
    },
    tanggal_keluar: {
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
    tableName: "pegawai",
  }
);

module.exports = { Pegawai };
