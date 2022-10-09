const { Op } = require("sequelize");
const { Jadwal } = require("../model/index");

const getJadwal = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let jadwal = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    jadwal = await Jadwal.findAll({
      attributes: [
        "id_jadwal",
        "waktu_masuk",
        "waktu_keluar",
        "is_aktif",
        "warna",
        "jenis",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          warna: {
            [Op.like]: "%" + search + "%",
          },
          jenis: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_jadwal", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    jadwal = await Jadwal.findAll({
      attributes: [
        "id_jadwal",
        "waktu_masuk",
        "waktu_keluar",
        "is_aktif",
        "warna",
        "jenis",
      ],
      order: [["id_jadwal", "asc"]],
      where: {
        id_client: client_id,
      },
      limit: skip,
      offset: offset,
    });
  }

  if (limit == null && search != null) {
    jadwal = await Jadwal.findAll({
      attributes: [
        "id_jadwal",
        "waktu_masuk",
        "waktu_keluar",
        "is_aktif",
        "warna",
        "jenis",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          warna: {
            [Op.like]: "%" + search + "%",
          },
          jenis: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_jadwal", "asc"]],
    });
  }
  return jadwal;
};

const getAllJadwal = async (client_id = null) => {
  let jadwal = "";
  if (client_id != null) {
    jadwal = await Jadwal.findAll({
      attributes: [
        "id_jadwal",
        "waktu_masuk",
        "waktu_keluar",
        "is_aktif",
        "warna",
        "jenis",
      ],
      where: {
        id_client: client_id,
      },
      order: [["id_jadwal", "asc"]],
    });
  }
  return jadwal;
};

const jadwalById = async (id_jadwal = null) => {
  let jadwal = "";
  if (id_jadwal != null) {
    jadwal = await Jadwal.findOne({
      where: {
        id_jadwal: id_jadwal,
      },
      order: [["id_jadwal", "asc"]],
    });
  }
  return jadwal;
};
module.exports = {
  getJadwal,
  Jadwal,
  getAllJadwal,
  jadwalById
};
