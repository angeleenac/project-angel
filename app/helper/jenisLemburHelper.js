const { JenisLembur } = require("../model/index");

const getJenisLembur = async (
  skip = null,
  offset = null,
  search = null,
  limit = null,
  client_id = null
) => {
  let jenis_lembur = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    jenis_lembur = await JenisLembur.findAll({
      attributes: [
        "id_jenis_lembur",
        "id_client",
        "jenis_lembur",
        "is_aktif",
        "jenis_jadwal",
        "jenis_perhitungan",
        "formula",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_lembur: {
            [Op.like]: "%" + search + "%",
          },
          jenis_jadwal: {
            [Op.like]: "%" + search + "%",
          },
          jenis_perhitungan: {
            [Op.like]: "%" + search + "%",
          },
          formula: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_lembur", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    jenis_lembur = await JenisLembur.findAll({
      attributes: [
        "id_jenis_lembur",
        "id_client",
        "jenis_lembur",
        "is_aktif",
        "jenis_jadwal",
        "jenis_perhitungan",
        "formula",
      ],
      order: [["id_jenis_lembur", "asc"]],
      limit: skip,
      offset: offset,
      where: {
        id_client: client_id,
      },
    });
  }

  if (limit == null && search != null) {
    jenis_lembur = await JenisLembur.findAll({
      attributes: [
        "id_jenis_lembur",
        "id_client",
        "jenis_lembur",
        "is_aktif",
        "jenis_jadwal",
        "jenis_perhitungan",
        "formula",
      ],
      where: {
        id_client: client_id,
        [Op.or]: {
          jenis_lembur: {
            [Op.like]: "%" + search + "%",
          },
          jenis_jadwal: {
            [Op.like]: "%" + search + "%",
          },
          jenis_perhitungan: {
            [Op.like]: "%" + search + "%",
          },
          formula: {
            [Op.like]: "%" + search + "%",
          },
        },
      },

      order: [["id_jenis_lembur", "asc"]],
    });
  }
  return jenis_lembur;
};

module.exports = {
  JenisLembur,
  getJenisLembur,
};
