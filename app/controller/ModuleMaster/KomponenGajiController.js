const { validationResult } = require("express-validator");
const { komponenGajiHelper, pagination } = require("../../helper/index");
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

      let komponenGaji = await komponenGajiHelper.getKomponenGaji(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await komponenGajiHelper.KomponenGaji.count();
      if (search != null && search != "") {
        komponenGaji = await komponenGajiHelper.getKomponenGaji(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await komponenGajiHelper.getKomponenGaji(
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
        data: komponenGaji,
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
      label: "Komponen Gaji",
      url: "/admin/komponenGaji?client_id=" + id_client,
      isActive: "active",
    });

    res.render("./moduleMaster/komponenGaji/index", {
      title: "Komponen Gaji",
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
        let insert = await komponenGajiHelper.KomponenGaji.create({
          id_client: response.id_client,
          komponen_gaji: response.komponen_gaji,
          jenis: response.jenis,
          kelompok_komponen: response.kelompok_komponen,
          komponen: response.komponen,
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
        let id_komponen_gaji = response.id_komponen_gaji;
        let update = await komponenGajiHelper.KomponenGaji.update(
          {
            id_client: response.id_client,
            komponen_gaji: response.komponen_gaji,
            jenis: response.jenis,
            kelompok_komponen: response.kelompok_komponen,
            komponen: response.komponen,
            is_aktif: 1,
            user_update: 1,
            time_update: dateTime,
          },
          {
            where: {
              id_komponen_gaji: id_komponen_gaji,
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
  const id_komponen_gaji = req.params.id_komponen_gaji;
  const getKomponenGaji = await komponenGajiHelper.KomponenGaji.findOne({
    where: { id_komponen_gaji: id_komponen_gaji },
  });
  if (getKomponenGaji) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data komponenGaji",
      result: getKomponenGaji,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data komponenGaji",
    });
  }
};

const deleteData = async (req, res) => {
  const id_komponen_gaji = req.params.id_komponen_gaji;
  const getKomponenGaji = await komponenGajiHelper.KomponenGaji.destroy({
    where: {
      id_komponen_gaji: id_komponen_gaji,
    },
  });

  if (getKomponenGaji) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data komponenGaji",
      result: getKomponenGaji,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data komponenGaji",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
