const { Cabang } = require("../model/index");
const { Op } = require("sequelize");

const getCabang = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let cabang = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    cabang = await Cabang.findAll({
      attributes: ["id_cabang", "nama_cabang", "alamat", "kontak", "is_aktif"],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_cabang: {
            [Op.like]: "%" + search + "%",
          },
          alamat: {
            [Op.like]: "%" + search + "%",
          },
          kontak: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_cabang", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    cabang = await Cabang.findAll({
      attributes: ["id_cabang", "nama_cabang", "alamat", "kontak", "is_aktif"],
      order: [["id_cabang", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    cabang = await Cabang.findAll({
      attributes: ["id_cabang", "nama_cabang", "alamat", "kontak", "is_aktif"],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_cabang: {
            [Op.like]: "%" + search + "%",
          },
          alamat: {
            [Op.like]: "%" + search + "%",
          },
          kontak: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_cabang", "asc"]],
    });
  }
  return cabang;
};

const getCabangById = async (id_cabang = null) => {
  let cabang = "";
  cabang = await Cabang.findAll({
    attributes: [
      "id_cabang",
      "nama_cabang",
      "alamat",
      "kontak",
      "is_aktif",
      "longitude",
      "latitude",
    ],
    where: {
      id_cabang: id_cabang,
    },
    order: [["id_cabang", "asc"]],
  });

  return cabang;
};

module.exports = {
  getCabang,
  getCabangById,
  Cabang,
};
