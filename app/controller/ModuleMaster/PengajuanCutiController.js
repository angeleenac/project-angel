const { validationResult } = require("express-validator");
const {
  clientHelper,
  pagination,
  pengajuanCutiHelper,
} = require("../../helper/index");
const moment = require("moment");

const index = async (req, res) => {
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

  let pengajuanCuti = await pengajuanCutiHelper.getPengajuanCuti(limit, skip, null, null);

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

      let pengajuanCuti = await pengajuanCutiHelper.getPengajuanCuti(
        limit,
        skip,
        null,
        null
      );
      let model = await pengajuanCutiHelper.PengajuanCuti.count();
      if (search != null && search != "") {
        pengajuanCuti = await pengajuanCutiHelper.getPengajuanCuti(
          null,
          null,
          search,
          limit
        );
        let getModel = await pengajuanCutiHelper.getPengajuanCuti(
          null,
          null,
          search,
          null
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
        data: pengajuanCuti,
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
      label: "Client",
      url: "/admin/client",
    });
    breadcrumb.push({
      label: "PengajuanCuti",
      url: "/admin/pengajuanCuti",
      isActive: "active",
    });

    let getPengajuanCuti = await pengajuanCutiHelper.getPengajuanCuti();
    let dataClient = await clientHelper.Client.findAll();
    res.render("./moduleMaster/pengajuanCuti/index", {
      title: "PengajuanCuti",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      dataClient: dataClient,
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
        let insert = await pengajuanCutiHelper.PengajuanCuti.create({
          id_client: response.id_client,
          tanggal_awal_cuti: moment(response.tanggal_awal_cuti, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          tanggal_akhir_cuti: moment(response.tanggal_akhir_cuti, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          is_setuju: 1,
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
        let id_pengajuan_cuti = response.id_pengajuan_cuti;
        let update = await pengajuanCutiHelper.PengajuanCuti.update(
          {
            id_client: response.id_client,
            tanggal_awal_cuti: moment(response.tanggal_awal_cuti, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            tanggal_akhir_cuti: moment(response.tanggal_akhir_cuti, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            is_setuju: 1,
            user_create: 1,
            user_update: 1,
            time_create: dateTime,
            time_update: dateTime,
          },
          {
            where: {
              id_pengajuan_cuti: id_pengajuan_cuti,
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
  const id_pengajuan_cuti = req.params.id_pengajuan_cuti;
 
  const getPengajuanCuti = await pengajuanCutiHelper.PengajuanCuti.findOne({
    where: { id_pengajuan_cuti: id_pengajuan_cuti },
  });
  if (getPengajuanCuti) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data langganan",
      result: getPengajuanCuti,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data langganan",
    });
  }
};

const deleteData = async (req, res) => {
  const id_pengajuan_cuti = req.params.id_pengajuan_cuti;
  const getPengajuanCuti = await pengajuanCutiHelper.PengajuanCuti.destroy({
    where: {
      id_pengajuan_cuti: id_pengajuan_cuti,
    },
  });

  if (getPengajuanCuti) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data langganan",
      result: getPengajuanCuti,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data langganan",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
