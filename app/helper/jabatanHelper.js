const { Op } = require("sequelize");
const { Jabatan, Unit } = require("../model/index");

const getJabatan = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let jabatan = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    jabatan = await Jabatan.findAll({
      attributes: [
        "id_jabatan",
        "id_client",
        "id_unit",
        "nama_jabatan",
        "membawahi_jabatan",
        "is_parent",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_jabatan: {
            [Op.like]: "%" + search + "%",
          },
          "$cabang.nama_unit$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Unit,
        },
      ],
      order: [["id_jabatan", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    jabatan = await Jabatan.findAll({
      attributes: [
        "id_jabatan",
        "id_client",
        "id_unit",
        "nama_jabatan",
        "membawahi_jabatan",
        "is_parent",
        "is_aktif",
      ],
      order: [["id_jabatan", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
      include: [
        {
          model: Unit,
        },
      ],
    });
  }

  if (limit == null && search != null) {
    jabatan = await Jabatan.findAll({
      attributes: [
        "id_jabatan",
        "id_client",
        "id_unit",
        "nama_jabatan",
        "membawahi_jabatan",
        "is_parent",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_jabatan: {
            [Op.like]: "%" + search + "%",
          },
          "$cabang.nama_unit$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Unit,
        },
      ],
      order: [["id_jabatan", "asc"]],
    });
  }
  return jabatan;
};

const getJabatanId = async (jabatan_id) => {
  let jabatan = "";
  if (jabatan_id[0] != "" && jabatan_id[0] != null) {
    jabatan = await Jabatan.findAll({
      attributes: ["nama_jabatan"],
      where: {
        id_jabatan: {
          [Op.in]: jabatan_id,
        },
      },
    });
  }

  return jabatan;
};

const getJabatanAll = async () => {
  let jabatan = await Jabatan.findAll();
  return jabatan;
};

module.exports = {
  getJabatanId,
  getJabatanAll,
  getJabatan,
  Jabatan,
};
