const { Op } = require("sequelize");
const { JenisCuti } = require("../model/index");

const getJenisCuti = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let jenis_cuti = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    jenis_cuti = await JenisCuti.findAll({
      attributes: [
        "id_jenis_cuti",
        "id_client",
        "jenis_cuti",
        "is_aktif",
        "saldo",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_cuti: {
            [Op.like]: "%" + search + "%",
          },
          saldo: {
            [Op.like]: "%" + search + "%",
          },
          is_aktif: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_cuti", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    jenis_cuti = await JenisCuti.findAll({
      attributes: [
        "id_jenis_cuti",
        "id_client",
        "jenis_cuti",
        "is_aktif",
        "saldo",
      ],
      order: [["id_jenis_cuti", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    jenis_cuti = await JenisCuti.findAll({
      attributes: [
        "id_jenis_cuti",
        "id_client",
        "jenis_cuti",
        "is_aktif",
        "saldo",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_cuti: {
            [Op.like]: "%" + search + "%",
          },
          saldo: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_cuti", "asc"]],
    });
  }
  return jenis_cuti;
};

module.exports = {
  getJenisCuti,
  JenisCuti,
};
