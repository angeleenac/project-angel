const { validationResult } = require("express-validator");
const usersModel = require("../../helper/userHelper");
const userMappingModel = require("../../helper/userMappingHelper");
const { getAllJadwal } = require("../../helper/jadwalHelper");
const { getCabangById } = require("../../helper/cabangHelper");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const index = async (req, res) => {
  try {
    let user = req.user.data;
    // get data maping
    const getMapping = await userMappingModel.getJoinDataMapping(
      user.jenis_mapping,
      null,
      user.id_user_mapping
    );
    const id_client = getMapping.pegawai.id_client;
    const id_cabang = getMapping.pegawai.id_absensi;

    let output = {};
    output.user = getMapping;
    output.jadwal = await getAllJadwal(id_client);
    output.cabang = await getCabangById(id_cabang);

    // get data jadwal
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data profile",
      result: output,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data",
      result: err,
    });
  }
};

module.exports = {
  index,
};
