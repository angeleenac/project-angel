const { validationResult } = require("express-validator");
const { clientHelper, pagination } = require("../../helper/index");
const moment = require("moment");

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

      let client = await clientHelper.getClient(limit, skip);
      let model = await clientHelper.Client.count();
      if (search != null && search != "") {
        client = await clientHelper.getClient(null, null, search, limit);
        let getModel = await clientHelper.getClient(null, null, search);
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
        data: client,
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
      isActive: "active",
    });

    res.render("./moduleMaster/client/index", {
      title: "Client",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
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
        let insert = await clientHelper.Client.create({
          nama_client: response.nama_client,
          alamat: response.alamat,
          kontak: response.kontak,
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
        let id_client = response.id_client;
        let update = await clientHelper.Client.update(
          {
            nama_client: response.nama_client,
            alamat: response.alamat,
            kontak: response.kontak,
            is_aktif: 1,
            user_update: 1,
            time_update: dateTime,
          },
          {
            where: {
              id_client: id_client,
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
  const id_client = req.params.id_client;
  const getClient = await clientHelper.Client.findOne({
    where: { id_client: id_client },
  });
  if (getClient) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data client",
      result: getClient,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data client",
    });
  }
};

const deleteData = async (req, res) => {
  const id_client = req.params.id_client;
  const getClient = await clientHelper.Client.destroy({
    where: {
      id_client: id_client,
    },
  });

  if (getClient) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data client",
      result: getClient,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data client",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
