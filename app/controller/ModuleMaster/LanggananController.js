const { validationResult } = require("express-validator");
const {
  clientHelper,
  pagination,
  langgananHelper,
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

  let langganan = await langgananHelper.getLangganan(limit, skip, null, null);

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

      let langganan = await langgananHelper.getLangganan(
        limit,
        skip,
        null,
        null
      );
      let model = await langgananHelper.Langganan.count();
      if (search != null && search != "") {
        langganan = await langgananHelper.getLangganan(
          null,
          null,
          search,
          limit
        );
        let getModel = await langgananHelper.getLangganan(
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
        data: langganan,
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
      label: "Langganan",
      url: "/admin/langganan",
      isActive: "active",
    });

    let getLangganan = await langgananHelper.getLangganan();
    let dataClient = await clientHelper.Client.findAll();
    res.render("./moduleMaster/langganan/index", {
      title: "Langganan",
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
        let insert = await langgananHelper.Langganan.create({
          id_client: response.id_client,
          waktu_mulai: moment(response.waktu_mulai, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
          waktu_selesai: moment(response.waktu_selesai, "DD-MM-YYYY").format(
            "YYYY-MM-DD"
          ),
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
        let id_langganan = response.id_langganan;
        let update = await langgananHelper.Langganan.update(
          {
            id_client: response.id_client,
            waktu_mulai: moment(response.waktu_mulai, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            waktu_selesai: moment(response.waktu_selesai, "DD-MM-YYYY").format(
              "YYYY-MM-DD"
            ),
            is_aktif: 1,
            user_create: 1,
            user_update: 1,
            time_create: dateTime,
            time_update: dateTime,
          },
          {
            where: {
              id_langganan: id_langganan,
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
  const id_langganan = req.params.id_langganan;
  const getLangganan = await langgananHelper.Langganan.findOne({
    where: { id_langganan: id_langganan },
  });
  if (getLangganan) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data langganan",
      result: getLangganan,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data langganan",
    });
  }
};

const deleteData = async (req, res) => {
  const id_langganan = req.params.id_langganan;
  const getLangganan = await langgananHelper.Langganan.destroy({
    where: {
      id_langganan: id_langganan,
    },
  });

  if (getLangganan) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data langganan",
      result: getLangganan,
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
