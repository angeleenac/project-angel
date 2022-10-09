const pegawaiModel = require("../../helper/pegawaiHelper");
const { pagination } = require("../../helper/paginationResult");
var moment = require("moment");
const { validationResult } = require("express-validator");

const index = async (req, res) => {
  try {
    if (req.xhr) {
      let id_client = req.query.client_id;
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

      let pegawai = await pegawaiModel.getPegawai(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await pegawaiModel.Pegawai.count();
      if (search != null && search != "") {
        pegawai = await pegawaiModel.getPegawai(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await pegawaiModel.getPegawai(
          null,
          null,
          search,
          null,
          id_client
        );
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
        data: pegawai,
        pagination: getPagination,
        keterangan: keterangan,
      };
      return res.status(200).json({
        status: 200,
        message: "Berhasil tangkap data",
        output: output,
      });
    }
    let id_client = req.query.client_id;

    // breadcrumb
    let breadcrumb = [];
    breadcrumb.push({ label: "Home", url: "/admin/dashboard", isActive: "" });
    breadcrumb.push({
      label: "Client",
      url: "/admin/client",
    });
    breadcrumb.push({
      label: "Dashboard Client",
      url: "/admin/dashboardClient?client_id=" + id_client,
    });
    breadcrumb.push({
      label: "Pegawai",
      url: "/admin/pegawai?client_id=" + id_client,
      isActive: "active",
    });

    res.render("./moduleMaster/pegawai/index", {
      title: "Pegawai",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      id_client: id_client,
      client_id: id_client,
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
      if (response.page == "add") {
        let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let tanggal_keluar =
          response.tanggal_keluar != ""
            ? moment(response.tanggal_keluar, "DD-MM-YYYY").format("YYYY-MM-DD")
            : null;
        let insert = await pegawaiModel.Pegawai.create({
          id_client: response.id_client,
          id_absensi: response.id_absensi,
          jenis_identitas: response.jenis_identitas,
          no_identitas: response.no_identitas,
          nama_lengkap: response.nama_lengkap,
          jenis_kelamin: response.jenis_kelamin,
          tanggal_lahir: moment(response.tanggal_lahir, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          tempat_lahir: response.tempat_lahir,
          status_perkawinan: response.status_perkawinan,
          agama: response.agama,
          pendidikan: response.pendidikan,
          alamat_domisili: response.alamat_domisili,
          alamat_ktp: response.alamat_ktp,
          no_kontak1: response.no_kontak1,
          no_kontak2: response.no_kontak2,
          email: response.email,
          no_pegawai: response.no_pegawai,
          tanggal_masuk: moment(response.tanggal_masuk, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          tanggal_keluar: tanggal_keluar,
          is_aktif: 1,
          user_create: 1,
          user_update: 1,
          time_create: dateTime,
          time_update: dateTime,
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
        let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
        let id_pegawai = response.id_pegawai;

        let pegawai = pegawaiModel.getPegawaiById(id_pegawai);
        let tanggal_keluar =
          response.tanggal_keluar != ""
            ? moment(response.tanggal_keluar, "DD-MM-YYYY").format("YYYY-MM-DD")
            : pegawai.tanggal_keluar;

        let update = await pegawaiModel.Pegawai.update(
          {
            id_client: response.id_client,
            id_absensi: response.id_absensi,
            jenis_identitas: response.jenis_identitas,
            no_identitas: response.no_identitas,
            nama_lengkap: response.nama_lengkap,
            jenis_kelamin: response.jenis_kelamin,
            tanggal_lahir: moment(response.tanggal_lahir, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            tempat_lahir: response.tempat_lahir,
            status_perkawinan: response.status_perkawinan,
            agama: response.agama,
            pendidikan: response.pendidikan,
            alamat_domisili: response.alamat_domisili,
            alamat_ktp: response.alamat_ktp,
            no_kontak1: response.no_kontak1,
            no_kontak2: response.no_kontak2,
            email: response.email,
            no_pegawai: response.no_pegawai,
            tanggal_masuk: moment(response.tanggal_masuk, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            tanggal_keluar: tanggal_keluar,
            is_aktif: 1,
            user_update: 1,
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
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 400,
      message: "Gagal insert data",
      result: error,
    });
  }
};

const edit = async (req, res) => {
  const id_pegawai = req.params.id_pegawai;
  const getPegawai = await pegawaiModel.Pegawai.findOne({
    where: { id_pegawai: id_pegawai },
  });
  if (getPegawai) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data pegawai",
      result: getPegawai,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data pegawai",
    });
  }
};

const deleteData = async (req, res) => {
  const id_pegawai = req.params.id_pegawai;
  const getPegawai = await pegawaiModel.Pegawai.destroy({
    where: {
      id_pegawai: id_pegawai,
    },
  });

  if (getPegawai) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data pegawai",
      result: getPegawai,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data pegawai",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
