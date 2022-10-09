const { validationResult } = require("express-validator");
var moment = require("moment");
const { pegawaiHelper, userMappingHelper } = require("../../helper/index");

const index = async (req, res) => {
  try {
    const data = req.user.data;
    // get data maping
    const getMapping = await userMappingHelper.getJoinDataMapping(
      data.jenis_mapping,
      null,
      data.id_user_mapping
    );

    // get data jadwal
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data profile",
      result: getMapping,
    });
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Terjadi kesalahan",
      result: err,
    });
  }
};

const store = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 400,
        message: "Invalid form validation",
        result: errors.array(),
      });
    }

    const data = req.user.data;
    // get data maping
    const getMapping = await userMappingHelper.getJoinDataMapping(
      data.jenis_mapping,
      null,
      data.id_user_mapping
    );

    const { body } = req;
    let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
    let id_pegawai = getMapping.pegawai.id_pegawai;

    let tanggal_keluar_old = getMapping.pegawai.tanggal_keluar;
    let tanggal_keluar =
      body.tanggal_keluar != ""
        ? moment(body.tanggal_keluar, "DD-MM-YYYY").format("YYYY-MM-DD")
        : tanggal_keluar_old;

    let update = await pegawaiHelper.Pegawai.update(
      {
        jenis_identitas: body.jenis_identitas,
        no_identitas: body.no_identitas,
        nama_lengkap: body.nama_lengkap,
        jenis_kelamin: body.jenis_kelamin,
        tanggal_lahir: moment(body.tanggal_lahir, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        tempat_lahir: body.tempat_lahir,
        status_perkawinan: body.status_perkawinan,
        agama: body.agama,
        pendidikan: body.pendidikan,
        alamat_domisili: body.alamat_domisili,
        alamat_ktp: body.alamat_ktp,
        no_kontak1: body.no_kontak1,
        no_kontak2: body.no_kontak2,
        email: body.email,
        no_pegawai: body.no_pegawai,
        tanggal_masuk: moment(body.tanggal_masuk, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
        tanggal_keluar: tanggal_keluar,
        user_update: getMapping.id_user,
        time_update: dateTime,
      },
      {
        where: {
          id_pegawai: id_pegawai,
        },
      }
    );

    if (update) {
      return res.json({
        status: 200,
        message: "Berhasil update data",
      });
    } else {
      return res.json({
        status: 400,
        message: "Gagal update data",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Terjadi kesalahan",
      result: err,
    });
  }
};

module.exports = {
  index,
  store,
};
