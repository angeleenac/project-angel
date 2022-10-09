const { Client, Langganan } = require("../model/index");
const { Op } = require("sequelize");

const getLangganan = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let langganan = "";

  if (search != null && search != "" && limit != "" && limit != null) {
    langganan = await Langganan.findAll({
      attributes: [
        "id_langganan",
        "id_client",
        "waktu_mulai",
        "waktu_selesai",
        "is_aktif",
      ],
      where: {
        [Op.or]: {
          "$client.nama_client$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
      order: [["id_langganan", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    langganan = await Langganan.findAll({
      attributes: [
        "id_langganan",
        "id_client",
        "waktu_mulai",
        "waktu_selesai",
        "is_aktif",
      ],
      order: [["id_langganan", "asc"]],
      limit: skip,
      offset: offset,
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
    });
  }

  if (limit == null && search != null) {
    langganan = await Langganan.findAll({
      attributes: [
        "id_langganan",
        "id_client",
        "waktu_mulai",
        "waktu_selesai",
        "is_aktif",
      ],
      where: {
        [Op.or]: {
          "$client.nama_client$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
      order: [["id_langganan", "asc"]],
    });
  }
  return langganan;
};

module.exports = {
  getLangganan,
  Langganan,
};
