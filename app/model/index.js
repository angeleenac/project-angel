const { Cabang } = require("./CabangModel");
const { Client } = require("./ClientModel");
const { Jabatan } = require("./JabatanModel");
const { Jadwal } = require("./JadwalModel");
const { JenisAbsensi } = require("./JenisAbsensiModel");
const { JenisCuti } = require("./JenisCutiModel");
const { JenisLembur } = require("./jenisLemburModel");
const { KomponenGaji } = require("./KomponenGajiModel");
const { Pegawai } = require("./PegawaiModel");
const { Unit } = require("./UnitModel");
const { UserMapping } = require("./UsersMappingModel");
const { Users } = require("./UsersModel");
const { PegawaiJadwal } = require("./PegawaiJadwalModel");
const { Langganan } = require("./LanggananModel");
const { PengajuanCuti } = require("./PengajuanCutiModel");

Unit.hasOne(Cabang, {
  foreignKey: "id_cabang",
});
Unit.belongsTo(Cabang, {
  foreignKey: "id_cabang",
});

Jabatan.hasOne(Unit, {
  foreignKey: "id_unit",
});
Jabatan.belongsTo(Unit, {
  foreignKey: "id_unit",
});

Langganan.hasOne(Client, {
  foreignKey: "id_client",
});
Langganan.belongsTo(Client, {
  foreignKey: "id_client",
});

PegawaiJadwal.hasOne(Pegawai, {
  foreignKey: "id_pegawai",
});
PegawaiJadwal.belongsTo(Pegawai, {
  foreignKey: "id_pegawai",
});

PegawaiJadwal.hasOne(Jadwal, {
  foreignKey: "id_jadwal",
});
PegawaiJadwal.belongsTo(Jadwal, {
  foreignKey: "id_jadwal",
});

PegawaiJadwal.hasOne(JenisAbsensi, {
  foreignKey: "id_jenis_absensi",
});
PegawaiJadwal.belongsTo(JenisAbsensi, {
  foreignKey: "id_jenis_absensi",
});

UserMapping.hasOne(Pegawai, {
  foreignKey: "id_pegawai",
});
UserMapping.belongsTo(Pegawai, {
  foreignKey: "id_mapping",
});

UserMapping.hasOne(Client, {
  foreignKey: "id_client",
});
UserMapping.belongsTo(Client, {
  foreignKey: "id_mapping",
});

Users.hasOne(UserMapping, {
  foreignKey: "id_user",
});
UserMapping.belongsTo(Users, {
  foreignKey: "id_user",
});

PengajuanCuti.hasOne(JenisCuti, {
  foreignKey: "id_jenis_cuti",
});
PengajuanCuti.belongsTo(JenisCuti, {
  foreignKey: "id_jenis_cuti",
});

PengajuanCuti.hasOne(Pegawai, {
  foreignKey: "id_pegawai",
});
PengajuanCuti.belongsTo(Pegawai, {
  foreignKey: "id_pegawai",
});

module.exports = {
  Cabang,
  Client,
  Jabatan,
  Jadwal,
  JenisAbsensi,
  JenisCuti,
  JenisLembur,
  KomponenGaji,
  Pegawai,
  Unit,
  UserMapping,
  Users,
  PegawaiJadwal,
  Langganan,
  PengajuanCuti,
};
