const { DataTypes, Sequelize, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { Pegawai, Jadwal, JenisAbsensi } = require("./index");

const PegawaiJadwal = sequelize.define(
  "pegawai_jadwal",
  {
    id_pegawai_jadwal: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pegawai: {
      type: DataTypes.INTEGER,
      references: {
        model: Pegawai,
        key: "id_pegawai",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    id_jadwal: {
      type: DataTypes.INTEGER,
      references: {
        model: Jadwal,
        key: "id_jadwal",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    tanggal: {
      type: DataTypes.DATEONLY,
    },
    is_kerja: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_hadir: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    waktu_masuk: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
    },
    waktu_pulang: {
      type: "TIMESTAMP",
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      allowNull: true,
    },
    is_terlambat: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_pulang_cepat: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_cuti: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_lembur: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total_jam_kerja: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_jam_kerja_real: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_jam_terlambat: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_jam_pulang_cepat: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_jam_lembur: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    alasan_terlambat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alasan_pulang_cepat: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_jenis_absensi: {
      type: DataTypes.INTEGER,
      references: {
        model: JenisAbsensi,
        key: "id_jenis_absensi",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
  },
  {
    timestamps: false,
    tableName: "pegawai_jadwal",
  }
);

module.exports = { PegawaiJadwal };
