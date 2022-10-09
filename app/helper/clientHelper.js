const { Op } = require("sequelize");
const { Client } = require("../model/index");

const getClient = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let client = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    client = await Client.findAll({
      attributes: ["id_client", "nama_client", "alamat", "kontak", "is_aktif"],
      where: {
        [Op.or]: {
          nama_client: {
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
      order: [["id_client", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    client = await Client.findAll({
      attributes: ["id_client", "nama_client", "alamat", "kontak", "is_aktif"],
      order: [["id_client", "asc"]],
      limit: skip,
      offset: offset,
    });
  }

  if (limit == null && search != null) {
    client = await Client.findAll({
      attributes: ["id_client", "nama_client", "alamat", "kontak", "is_aktif"],
      where: {
        [Op.or]: {
          nama_client: {
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
      order: [["id_client", "asc"]],
    });
  }
  return client;
};

const getClientNotId = async (id_client = []) => {
  let client = "";
  client = await Client.findAll({
    attributes: ["id_client", "nama_client", "alamat", "kontak", "is_aktif"],
    where: {
      id_client: {
        [Op.notIn]: id_client,
      },
    },
    order: [["id_client", "asc"]],
  });
  return client;
};

module.exports = {
  getClient,
  getClientNotId,
  Client,
};
