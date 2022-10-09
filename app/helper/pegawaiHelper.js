const { Op } = require("sequelize");
const { Pegawai } = require("../model/index");

const getPegawai = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let pegawai = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    pegawai = await Pegawai.findAll({
      attributes: [
        "id_pegawai",
        "id_client",
        "no_identitas",
        "nama_lengkap",
        "jenis_kelamin",
        "tempat_lahir",
        "tanggal_lahir",
        "no_kontak1",
        "email",
        "no_pegawai",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          no_identitas: {
            [Op.like]: "%" + search + "%",
          },
          nama_lengkap: {
            [Op.like]: "%" + search + "%",
          },
          jenis_kelamin: {
            [Op.like]: "%" + search + "%",
          },
          tempat_lahir: {
            [Op.like]: "%" + search + "%",
          },

          no_kontak1: {
            [Op.like]: "%" + search + "%",
          },
          email: {
            [Op.like]: "%" + search + "%",
          },
          no_pegawai: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_pegawai", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    pegawai = await Pegawai.findAll({
      attributes: [
        "id_pegawai",
        "id_client",
        "no_identitas",
        "nama_lengkap",
        "jenis_kelamin",
        "tempat_lahir",
        "tanggal_lahir",
        "no_kontak1",
        "email",
        "no_pegawai",
      ],
      order: [["id_pegawai", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    pegawai = await Pegawai.findAll({
      attributes: [
        "id_pegawai",
        "id_client",
        "no_identitas",
        "nama_lengkap",
        "jenis_kelamin",
        "tempat_lahir",
        "tanggal_lahir",
        "no_kontak1",
        "email",
        "no_pegawai",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          no_identitas: {
            [Op.like]: "%" + search + "%",
          },
          nama_lengkap: {
            [Op.like]: "%" + search + "%",
          },
          jenis_kelamin: {
            [Op.like]: "%" + search + "%",
          },
          tempat_lahir: {
            [Op.like]: "%" + search + "%",
          },
          no_kontak1: {
            [Op.like]: "%" + search + "%",
          },
          email: {
            [Op.like]: "%" + search + "%",
          },
          no_pegawai: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_pegawai", "asc"]],
    });
  }
  return pegawai;
};

const checkIdentitas = (identitas, page, value, id_pegawai = null) => {
  let check = "";
  if (page == "add") {
    if (identitas == "no_identitas") {
      check = Pegawai.count({
        where: {
          no_identitas: value,
        },
      });
    }
    if (identitas == "no_pegawai") {
      check = Pegawai.count({
        where: {
          no_pegawai: value,
        },
      });
    }
  } else {
    if (identitas == "no_identitas") {
      check = Pegawai.count({
        where: {
          no_identitas: value,
          id_pegawai: {
            [Op.not]: id_pegawai,
          },
        },
      });
    }
    if (identitas == "no_pegawai") {
      check = Pegawai.count({
        where: {
          no_pegawai: value,
          id_pegawai: {
            [Op.not]: id_pegawai,
          },
        },
      });
    }
  }
  return check;
};

const getPegawaiNotId = async (pegawai_id = []) => {
  let pegawai = "";
  pegawai = await Pegawai.findAll({
    attributes: [
      "id_pegawai",
      "id_client",
      "no_identitas",
      "nama_lengkap",
      "jenis_kelamin",
      "tempat_lahir",
      "tanggal_lahir",
      "no_kontak1",
      "email",
      "no_pegawai",
    ],
    where: {
      id_pegawai: {
        [Op.notIn]: pegawai_id,
      },
    },
    order: [["id_pegawai", "asc"]],
  });
  return pegawai;
};

const getPegawaiById = async (pegawai_id = []) => {
  let pegawai = "";
  pegawai = await Pegawai.findAll({
    attributes: [
      "id_pegawai",
      "id_client",
      "no_identitas",
      "nama_lengkap",
      "jenis_kelamin",
      "tempat_lahir",
      "tanggal_lahir",
      "no_kontak1",
      "email",
      "no_pegawai",
    ],
    where: {
      id_pegawai: pegawai_id,
    },
    order: [["id_pegawai", "asc"]],
  });
  return pegawai;
};
module.exports = {
  getPegawai,
  checkIdentitas,
  getPegawaiNotId,
  Pegawai,
  getPegawaiById,
};
