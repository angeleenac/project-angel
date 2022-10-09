const { Sequelize, DataTypes, Op, Deferrable } = require("sequelize");
const sequelize = require("../config/db");
const { JenisCuti, Pegawai } = require("./index");

const PengajuanCuti = sequelize.define(
  "pengajuanCuti",
  {
    id_pengajuan_cuti: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_jenis_cuti: {
      type: DataTypes.INTEGER,
      references: {
        model: JenisCuti,
        key: "id_jenis_cuti",
        deferrable: Deferrable.INITIALLY_IMMEDIATE,
      },
    },
    id_pegawai: {
        type: DataTypes.INTEGER,
        references: {
          model: Pegawai,
          key: "id_pegawai",
          deferrable: Deferrable.INITIALLY_IMMEDIATE,
        },
      },
    tanggal_awal_cuti: {
      type: DataTypes.DATEONLY,
    },
    tanggal_akhir_cuti: {
      type: DataTypes.DATEONLY,
    },
    id_pegawai_pengganti: {
        type: DataTypes.INTEGER,
    },
    catatan: {
        type: DataTypes.STRING,
    },
    id_atasan: {
        type: DataTypes.INTEGER,
    },
    is_setuju: {
      type: DataTypes.INTEGER,
    },
   waktu_pengajuan: {
        type: DataTypes.DATEONLY,
    },
    waktu_setuju: {
        type: DataTypes.DATEONLY,
    },
    tanggal_awal_cuti: {
      type: DataTypes.DATEONLY,
    },
    tanggal_akhir_cuti: {
      type: DataTypes.DATEONLY,
    },
    berkas: {
        type: DataTypes.STRING,
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
    tableName: "pengajuanCuti",
  }
);

module.exports = { PengajuanCuti };
