const { jenisCutiHelper, pagination } = require("../../helper/index");
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

      let jenisCuti = await jenisCutiHelper.getJenisCuti(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await jenisCutiHelper.JenisCuti.count();
      if (search != null && search != "") {
        jenisCuti = await jenisCutiHelper.getJenisCuti(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await jenisCutiHelper.getJenisCuti(
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
        data: jenisCuti,
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
      label: "Jenis Cuti",
      url: "/admin/jenisCuti?client_id=" + id_client,
      isActive: "active",
    });

    res.render("./moduleMaster/jenisCuti/index", {
      title: "Jenis Cuti",
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
        let insert = await jenisCutiHelper.JenisCuti.create({
          jenis_cuti: response.jenis_cuti,
          saldo: response.saldo,
          is_aktif: response.is_aktif,
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
        let id_jenis_cuti = response.id_jenis_cuti;
        let update = await jenisCutiHelper.JenisCuti.update(
          {
            jenis_cuti: response.jenis_cuti,
            saldo: response.saldo,
            is_aktif: response.is_aktif,
            user_update: 1,
            time_update: dateTime,
            id_client: response.id_client,
          },
          {
            where: {
              id_jenis_cuti: id_jenis_cuti,
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
  const id_jenis_cuti = req.params.id_jenis_cuti;
  const getJenisCuti = await jenisCutiHelper.JenisCuti.findOne({
    where: { id_jenis_cuti: id_jenis_cuti },
  });
  if (getJenisCuti) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data jenisCuti",
      result: getJenisCuti,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data jenisCuti",
    });
  }
};

const deleteData = async (req, res) => {
  const id_jenis_cuti = req.params.id_jenis_cuti;
  const getJenisCuti = await jenisCutiHelper.JenisCuti.destroy({
    where: {
      id_jenis_cuti: id_jenis_cuti,
    },
  });

  if (getJenisCuti) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data jenisCuti",
      result: getJenisCuti,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data jenisCuti",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
