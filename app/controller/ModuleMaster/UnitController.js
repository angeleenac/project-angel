const unitModel = require("../../helper/unitHelper");
const cabangModel = require("../../helper/cabangHelper");
const { pagination } = require("../../helper/paginationResult");
var moment = require("moment");
const { validationResult } = require("express-validator");
const { getUnitId, getUnitAll } = require("../../helper/unitHelper");

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

      let unit = await unitModel.getUnit(limit, skip, null, null, id_client);
      let model = await unitModel.Unit.count();
      if (search != null && search != "") {
        unit = await unitModel.getUnit(null, null, search, limit, id_client);
        let getModel = await unitModel.getUnit(
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
        data: unit,
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
      label: "Unit",
      url: "/admin/unit?client_id=" + id_client,
      isActive: "active",
    });

    let cabang = await cabangModel.Cabang.findAll();
    let unit = await unitModel.Unit.findAll();

    res.render("./moduleMaster/unit/index", {
      title: "Unit",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      id_client: id_client,
      client_id: id_client,
      cabang: cabang,
      unit: unit,
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
        let insert = await unitModel.Unit.create({
          id_client: response.id_client,
          id_cabang: response.id_cabang,
          nama_unit: response.nama_unit,
          membawahi_unit: response.membawahi_unit,
          is_parent: response.is_parent,
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
        let id_unit = response.id_unit;
        let update = await unitModel.Unit.update(
          {
            id_client: response.id_client,
            id_cabang: response.id_cabang,
            nama_unit: response.nama_unit,
            membawahi_unit: response.membawahi_unit,
            is_parent: response.is_parent,
            is_aktif: 1,
            user_update: 1,
            time_update: dateTime,
          },
          {
            where: {
              id_unit: id_unit,
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
  const id_unit = req.params.id_unit;
  const getUnit = await unitModel.Unit.findOne({
    where: { id_unit: id_unit },
  });
  if (getUnit) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data unit",
      result: getUnit,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data unit",
    });
  }
};

const deleteData = async (req, res) => {
  const id_unit = req.params.id_unit;
  const getUnit = await unitModel.Unit.destroy({
    where: {
      id_unit: id_unit,
    },
  });

  if (getUnit) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data unit",
      result: getUnit,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data unit",
    });
  }
};
const getFindInUnit = async (req, res) => {
  if (req.xhr) {
    const { unit_id } = req.query;
    const getUnit = await getUnitId(unit_id);
    if (getUnit) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil mendapatkan data unit",
        result: getUnit,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal mendapatkan data unit",
        result: getUnit,
      });
    }
  }
};
const getFindAllUnit = async (req, res) => {
  if (req.xhr) {
    const getJabatan = await getUnitAll();
    if (getJabatan) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil mendapatkan data jabatan",
        result: getJabatan,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal mendapatkan data jabatan",
        result: getJabatan,
      });
    }
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
  getFindInUnit,
  getFindAllUnit,
};
