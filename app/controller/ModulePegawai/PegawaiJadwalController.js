const {
  pagination,
  pegawaiJadwalHelper,
  pegawaiJadwalHelper: { getPegawaiJadwal },
  jadwalHelper,
  pegawaiHelper,
  jenisAbsensiHelper,
} = require("../../helper/index");
const { validationResult } = require("express-validator");
var moment = require("moment");

const index = async (req, res) => {
  try {
    if (req.xhr) {
      // page
      const page =
        req.query.page == null || req.query.page == "" ? 1 : req.query.page;
      const limit =
        req.query.limit == null || req.query.limit == "" ? 10 : req.query.limit;
      const search = req.query.search;

      const halamanAkhir = page * limit;
      const halmaanAwal = halamanAkhir - limit;
      const offset = halamanAkhir;
      const skip = halmaanAwal;

      let pegawaiJadwal = await getPegawaiJadwal(limit, skip, null, null);
      let model = await pegawaiJadwalHelper.PegawaiJadwal.count();
      if (search != null && search != "") {
        pegawaiJadwal = await getPegawaiJadwal(null, null, search, limit);
        let getModel = await getPegawaiJadwal(null, null, search, null);
        model = getModel.length;
      }

      // pagination
      const getPagination = pagination(page, model, limit);

      let keterangan = {
        from: skip + 1,
        to: offset,
        total: model,
      };

      let output = {
        data: pegawaiJadwal,
        pagination: getPagination,
        keterangan: keterangan,
      };
      return res.status(200).json({
        status: 200,
        message: "Berhasil tangkap data",
        output: output,
      });
    }

    // breadcrumb
    let breadcrumb = [];
    breadcrumb.push({ label: "Home", url: "/admin/dashboard", isActive: "" });
    breadcrumb.push({
      label: "Jadwal pegawai",
      url: "/admin/pegawaiJadwal",
    });

    // passing data
    let client_id = 20;
    let jadwal = await jadwalHelper.Jadwal.findAll({
      where: {
        id_client: client_id,
      },
    });
    let pegawai = await pegawaiHelper.Pegawai.findAll({
      where: {
        id_client: client_id,
      },
    });
    let jenisAbsensi = await jenisAbsensiHelper.JenisAbsensi.findAll({
      where: {
        id_client: client_id,
      },
    });

    res.render("./modulPegawai/pegawaiJadwal/index", {
      title: "Jadwal pegawai",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      jadwal: jadwal,
      pegawai: pegawai,
      jenisAbsensi: jenisAbsensi,
    });
  } catch (err) {
    console.log(err);
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
    } else {
      const response = req.body;
      let jadwal = await jadwalHelper.jadwalById(response.id_jadwal);
      let waktu_masuk = moment.duration(jadwal.waktu_masuk).asSeconds();
      let waktu_keluar = moment.duration(jadwal.waktu_keluar).asSeconds();
      let total_jam_kerja = waktu_keluar - waktu_masuk;
      total_jam_kerja = moment
        .utc(moment.duration(total_jam_kerja, "seconds").asMilliseconds())
        .format("HH:mm:ss");
      let tanggal =
        response.tanggal != ""
          ? moment(response.tanggal, "DD-MM-YYYY").format("YYYY-MM-DD")
          : null;
      let is_kerja = response.is_kerja != null ? 1 : 0;
      if (response.page == "add") {
        let insert = await pegawaiJadwalHelper.PegawaiJadwal.create({
          id_pegawai: response.id_pegawai,
          id_jadwal: response.id_jadwal,
          tanggal: tanggal,
          is_kerja: is_kerja,
          id_jenis_absensi: response.id_jenis_absensi,
          total_jam_kerja: total_jam_kerja,
        });

        if (insert) {
          return res.status(200).json({
            status: 200,
            message: "Berhasil insert data",
          });
        } else {
          return res.status(400).json({
            status: 400,
            message: "Gagal insert data",
          });
        }
      } else {
        let id_pegawai_jadwal = response.id_pegawai_jadwal;
        let is_kerja = response.is_kerja != null ? 1 : 0;
        let update = await pegawaiJadwalHelper.PegawaiJadwal.update(
          {
            id_pegawai: response.id_pegawai,
            id_jadwal: response.id_jadwal,
            tanggal: tanggal,
            is_kerja: is_kerja,
            id_jenis_absensi: response.id_jenis_absensi,
            total_jam_kerja: total_jam_kerja,
          },
          {
            where: {
              id_pegawai_jadwal: id_pegawai_jadwal,
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
      }
    }
  } catch (error) {
    console.log("get error", error);
    return res.status(400).json({
      status: 400,
      message: "Gagal insert data",
      result: error,
    });
  }
};

const edit = async (req, res) => {
  const id_pegawai_jadwal = req.params.id_pegawai_jadwal;
  const getPegawaiJadwal = await pegawaiJadwalHelper.PegawaiJadwal.findOne({
    where: { id_pegawai_jadwal: id_pegawai_jadwal },
  });
  if (getPegawaiJadwal) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data jadwal pegawai",
      result: getPegawaiJadwal,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data jadwal pegawai",
    });
  }
};

const deleteData = async (req, res) => {
  const id_pegawai_jadwal = req.params.id_pegawai_jadwal;
  const getPegawaiJadwal = await pegawaiJadwalHelper.PegawaiJadwal.destroy({
    where: {
      id_pegawai_jadwal: id_pegawai_jadwal,
    },
  });

  if (getPegawaiJadwal) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data pegawaiJadwal",
      result: getPegawaiJadwal,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data pegawaiJadwal",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
