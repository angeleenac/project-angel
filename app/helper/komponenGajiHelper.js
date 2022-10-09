const { KomponenGaji } = require("../model/index");

const getKomponenGaji = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let komponen_gaji = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    komponen_gaji = await KomponenGaji.findAll({
      attributes: [
        "id_komponen_gaji",
        "id_client",
        "komponen_gaji",
        "jenis",
        "kelompok_komponen",
        "komponen",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          komponen_gaji: {
            [Op.like]: "%" + search + "%",
          },
          jenis: {
            [Op.like]: "%" + search + "%",
          },
          kelompok_komponen: {
            [Op.like]: "%" + search + "%",
          },
          komponen: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_komponen_gaji", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    komponen_gaji = await KomponenGaji.findAll({
      attributes: [
        "id_komponen_gaji",
        "id_client",
        "komponen_gaji",
        "jenis",
        "kelompok_komponen",
        "komponen",
        "is_aktif",
      ],
      order: [["id_komponen_gaji", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    komponen_gaji = await KomponenGaji.findAll({
      attributes: [
        "id_komponen_gaji",
        "id_client",
        "komponen_gaji",
        "jenis",
        "kelompok_komponen",
        "komponen",
        "is_aktif",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          komponen_gaji: {
            [Op.like]: "%" + search + "%",
          },
          jenis: {
            [Op.like]: "%" + search + "%",
          },
          kelompok_komponen: {
            [Op.like]: "%" + search + "%",
          },
          komponen: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_komponen_gaji", "asc"]],
    });
  }
  return komponen_gaji;
};

module.exports = { KomponenGaji, getKomponenGaji };
