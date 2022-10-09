const { validationResult } = require("express-validator");
const { cabangHelper, pagination } = require("../../helper/index");
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

      let cabang = await cabangHelper.getCabang(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await cabangHelper.Cabang.count();
      if (search != null && search != "") {
        cabang = await cabangHelper.getCabang(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await cabangHelper.getCabang(
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
        data: cabang,
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
      label: "Cabang",
      url: "/admin/cabang?client_id=" + id_client,
      isActive: "active",
    });

    res.render("./moduleMaster/cabang/index", {
      title: "Cabang",
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
        let insert = await cabangHelper.Cabang.create({
          nama_cabang: response.nama_cabang,
          alamat: response.alamat,
          kontak: response.kontak,
          is_aktif: 1,
          user_create: 1,
          user_update: 1,
          time_create: dateTime,
          time_update: dateTime,
          id_client: response.id_client,
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
        let id_cabang = response.id_cabang;
        let update = await cabangHelper.Cabang.update(
          {
            nama_cabang: response.nama_cabang,
            alamat: response.alamat,
            kontak: response.kontak,
            is_aktif: 1,
            user_update: 1,
            time_update: dateTime,
            id_client: response.id_client,
          },
          {
            where: {
              id_cabang: id_cabang,
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
  const id_cabang = req.params.id_cabang;
  const getCabang = await cabangHelper.Cabang.findOne({
    where: { id_cabang: id_cabang },
  });
  if (getCabang) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data cabang",
      result: getCabang,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data cabang",
    });
  }
};

const deleteData = async (req, res) => {
  const id_cabang = req.params.id_cabang;
  const getCabang = await cabangHelper.Cabang.destroy({
    where: {
      id_cabang: id_cabang,
    },
  });

  if (getCabang) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data cabang",
      result: getCabang,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data cabang",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
