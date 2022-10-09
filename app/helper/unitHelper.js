const { Op } = require("sequelize");
const { Unit, Cabang } = require("../model/index");
const getUnitId = async (unit_id) => {
  let unit = "";
  if (unit_id[0] != "" && unit_id != null) {
    unit = await Unit.findAll({
      attributes: ["nama_unit"],
      where: {
        id_unit: {
          [Op.in]: unit_id,
        },
      },
    });
  }

  return unit;
};

const getUnitAll = async () => {
  let unit = await Unit.findAll();
  return unit;
};

const getUnit = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let unit = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    unit = await Unit.findAll({
      attributes: [
        "id_unit",
        "id_client",
        "id_cabang",
        "nama_unit",
        "membawahi_unit",
        "is_parent",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_unit: {
            [Op.like]: "%" + search + "%",
          },
          "$cabang.nama_cabang$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Cabang,
        },
      ],
      order: [["id_unit", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    unit = await Unit.findAll({
      attributes: [
        "id_unit",
        "id_client",
        "id_cabang",
        "nama_unit",
        "membawahi_unit",
        "is_parent",
        "is_aktif",
      ],
      order: [["id_unit", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
      include: [
        {
          model: Cabang,
        },
      ],
    });
  }

  if (limit == null && search != null) {
    unit = await Unit.findAll({
      attributes: [
        "id_unit",
        "id_client",
        "id_cabang",
        "nama_unit",
        "membawahi_unit",
        "is_parent",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          nama_unit: {
            [Op.like]: "%" + search + "%",
          },
          "$cabang.nama_cabang$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Cabang,
        },
      ],
      order: [["id_unit", "asc"]],
    });
  }
  return unit;
};

module.exports = {
  getUnitId,
  getUnitAll,
  getUnit,
  Unit,
};
