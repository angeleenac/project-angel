const { jadwalHelper, pagination } = require("../../helper/index");
const { validationResult } = require("express-validator");
const moment = require("moment");

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

      let jadwal = await jadwalHelper.getJadwal(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await jadwalHelper.Jadwal.count();
      if (search != null && search != "") {
        jadwal = await jadwalHelper.getJadwal(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await jadwalHelper.getJadwal(
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
        data: jadwal,
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
      label: "Jadwal",
      url: "/admin/jadwal?client_id=" + id_client,
      isActive: "active",
    });

    res.render("./moduleMaster/jadwal/index", {
      title: "Jadwal",
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
        let insert = await jadwalHelper.Jadwal.create({
          id_client: response.id_client,
          waktu_masuk: response.waktu_masuk,
          waktu_keluar: response.waktu_keluar,
          is_aktif: 1,
          warna: response.warna,
          jenis: response.jenis,
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
        let id_jadwal = response.id_jadwal;
        let update = await jadwalHelper.Jadwal.update(
          {
            id_client: response.id_client,
            waktu_masuk: response.waktu_masuk,
            waktu_keluar: response.waktu_keluar,
            is_aktif: 1,
            warna: response.warna,
            jenis: response.jenis,
          },
          {
            where: {
              id_jadwal: id_jadwal,
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
    return res.status(400).json({
      status: 400,
      message: "Gagal insert data",
      result: error,
    });
  }
};

const edit = async (req, res) => {
  const id_jadwal = req.params.id_jadwal;
  const getJadwal = await jadwalHelper.Jadwal.findOne({
    where: { id_jadwal: id_jadwal },
  });
  if (getJadwal) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data jadwal",
      result: getJadwal,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data jadwal",
    });
  }
};

const deleteData = async (req, res) => {
  const id_jadwal = req.params.id_jadwal;
  const getJadwal = await jadwalHelper.Jadwal.destroy({
    where: {
      id_jadwal: id_jadwal,
    },
  });

  if (getJadwal) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data jadwal",
      result: getJadwal,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data jadwal",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
