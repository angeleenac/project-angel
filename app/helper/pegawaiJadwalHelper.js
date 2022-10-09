const {
  Pegawai,
  Jadwal,
  JenisAbsensi,
  PegawaiJadwal,
} = require("../model/index");
const { Op } = require("sequelize");

const getPegawaiJadwal = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let varPegawaiJadwal = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    varPegawaiJadwal = await PegawaiJadwal.findAll({
      where: {
        [Op.or]: {
          "$pegawai.nama_lengkap$": {
            [Op.like]: "%" + search + "%",
          },
          "$jadwal.jenis$": {
            [Op.like]: "%" + search + "%",
          },
          "$jenis_absensi.jenis_absensi$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Pegawai,
        },
        {
          model: Jadwal,
        },
        {
          model: JenisAbsensi,
        },
      ],
      order: [["id_pegawai_jadwal", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    varPegawaiJadwal = await PegawaiJadwal.findAll({
      include: [
        {
          model: Pegawai,
        },
        {
          model: Jadwal,
        },
        {
          model: JenisAbsensi,
        },
      ],
      order: [["id_pegawai_jadwal", "asc"]],
      limit: skip,
      offset: offset,
    });
  }

  if (limit == null && search != null) {
    varPegawaiJadwal = await PegawaiJadwal.findAll({
      where: {
        [Op.or]: {
          "$pegawai.nama_lengkap$": {
            [Op.like]: "%" + search + "%",
          },
          "$jadwal.jenis$": {
            [Op.like]: "%" + search + "%",
          },
          "$jenis_absensi.jenis_absensi$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Pegawai,
        },
        {
          model: Jadwal,
        },
        {
          model: JenisAbsensi,
        },
      ],
      order: [["id_pegawai_jadwal", "asc"]],
    });
  }
  return varPegawaiJadwal;
};

module.exports = {
  getPegawaiJadwal,
  PegawaiJadwal,
};
