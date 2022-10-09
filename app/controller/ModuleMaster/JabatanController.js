const {
  jabatanHelper,
  jabatanHelper: { getJabatanId, getJabatanAll },
  unitHelper,
  pagination,
} = require("../../helper/index");
const moment = require("moment");
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

      let jabatan = await jabatanHelper.getJabatan(
        limit,
        skip,
        null,
        null,
        id_client
      );
      let model = await jabatanHelper.Jabatan.count();
      if (search != null && search != "") {
        jabatan = await jabatanHelper.getJabatan(
          null,
          null,
          search,
          limit,
          id_client
        );
        let getModel = await jabatanHelper.getJabatan(
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
        data: jabatan,
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
      label: "Jabatan",
      url: "/admin/jabatan?client_id=" + id_client,
      isActive: "active",
    });

    let unit = await unitHelper.Unit.findAll();

    res.render("./moduleMaster/jabatan/index", {
      title: "Jabatan",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      id_client: id_client,
      client_id: id_client,
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
        let insert = await jabatanHelper.Jabatan.create({
          id_client: response.id_client,
          id_unit: response.id_unit,
          nama_jabatan: response.nama_jabatan,
          membawahi_jabatan: response.membawahi_jabatan,
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
        let id_jabatan = response.id_jabatan;
        let update = await jabatanHelper.Jabatan.update(
          {
            id_client: response.id_client,
            id_unit: response.id_unit,
            nama_jabatan: response.nama_jabatan,
            membawahi_jabatan: response.membawahi_jabatan,
            is_parent: response.is_parent,
            is_aktif: 1,
            user_update: 1,
            time_update: dateTime,
          },
          {
            where: {
              id_jabatan: id_jabatan,
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
  const id_jabatan = req.params.id_jabatan;
  const getJabatan = await jabatanHelper.Jabatan.findOne({
    where: { id_jabatan: id_jabatan },
  });
  if (getJabatan) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data jabatan",
      result: getJabatan,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data jabatan",
    });
  }
};

const deleteData = async (req, res) => {
  const id_jabatan = req.params.id_jabatan;
  const getJabatan = await jabatanHelper.Jabatan.destroy({
    where: {
      id_jabatan: id_jabatan,
    },
  });

  if (getJabatan) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data jabatan",
      result: getJabatan,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data jabatan",
    });
  }
};

const getFindInJabatan = async (req, res) => {
  if (req.xhr) {
    const { jabatan_id } = req.query;
    const getJabatan = await getJabatanId(jabatan_id);
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

const getFindAllJabatan = async (req, res) => {
  if (req.xhr) {
    const getJabatan = await getJabatanAll();
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
  getFindInJabatan,
  getFindAllJabatan,
};
