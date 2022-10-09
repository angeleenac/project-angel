const { JenisCuti, Pegawai, PengajuanCuti } = require("../model/index");
const { Op } = require("sequelize");

const getPengajuanCuti = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let pengajuanCuti = "";

  if (search != null && search != "" && limit != "" && limit != null) {
    pengajuanCuti = await PengajuanCuti.findAll({
      attributes: [
        "id_pengajuan_cuti",
        "id_jenis_cuti",
        "id_pegawai",
        "tanggal_awal_cuti",
        "tanggal_akhir_cuti",
        "id_pegawai_pengganti",
        "catatan",
        "id_atasan",
        "is_setuju",
        "waktu_pengajuan",
        "waktu_setuju",
        "berkas",
      ],
      where: {
        [Op.or]: {
          "$pegawai.nama_pegawai$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
      ],
      order: [["id_", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    pengajuanCuti = await PengajuanCuti.findAll({
      attributes: [
        "id_pengajuan_cuti",
        "id_jenis_cuti",
        "id_pegawai",
        "tanggal_awal_cuti",
        "tanggal_akhir_cuti",
        "id_pegawai_pengganti",
        "catatan",
        "id_atasan",
        "is_setuju",
        "waktu_pengajuan",
        "waktu_setuju",
        "berkas",
      ],
      order: [["id_pengajuan_cuti", "asc"]],
      limit: skip,
      offset: offset,
      include: [
        {
          model: PengajuanCuti,
          as: "pengajuanCuti",
        },
      ],
    });
  }

  if (limit == null && search != null) {
    pengajuanCuti = await PengajuanCuti.findAll({
      attributes: [
        "id_pengajuan_cuti",
        "id_jenis_cuti",
        "id_pegawai",
        "tanggal_awal_cuti",
        "tanggal_akhir_cuti",
        "id_pegawai_pengganti",
        "catatan",
        "id_atasan",
        "is_setuju",
        "waktu_pengajuan",
        "waktu_setuju",
        "berkas",
      ],
      where: {
        [Op.or]: {
          "$pegawai.nama_pegawai$": {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      include: [
        {
          model: Pegawai,
          as: "pegawai",
        },
      ],
      order: [["id_pegawai_cuti", "asc"]],
    });
  }
  return pengajuanCuti;
};

module.exports = {
  getPengajuanCuti,
  PengajuanCuti,
};
