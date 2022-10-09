const { Op } = require("sequelize");
const { JenisAbsensi } = require("../model/index");

const getJenisAbsensi = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let jenis_absensi = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    jenis_absensi = await JenisAbsensi.findAll({
      attributes: [
        "id_jenis_absensi",
        "id_client",
        "jenis_absensi",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_absensi: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_absensi", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    jenis_absensi = await JenisAbsensi.findAll({
      attributes: [
        "id_jenis_absensi",
        "id_client",
        "jenis_absensi",
        "is_aktif",
      ],
      order: [["id_jenis_absensi", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    jenis_absensi = await JenisAbsensi.findAll({
      attributes: [
        "id_jenis_absensi",
        "id_client",
        "jenis_absensi",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_absensi: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_absensi", "asc"]],
    });
  }
  return jenis_absensi;
};

module.exports = {
  JenisAbsensi,
  getJenisAbsensi,
};
