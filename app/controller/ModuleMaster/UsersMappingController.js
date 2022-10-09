const { validationResult } = require("express-validator");
const {
  userHelper: { Users, getUsersById },
  pegawaiHelper: { getPegawaiNotId },
  clientHelper: { getClientNotId },
  userMappingHelper,
  pagination,
} = require("../../helper/index");

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

      let users = await userMappingHelper.getUserMapping(limit, skip);
      let model = await userMappingHelper.UserMapping.count();
      if (search != null && search != "") {
        users = await userMappingHelper.getUserMapping(
          null,
          null,
          search,
          limit
        );
        let getModel = await userMappingHelper.getUserMapping(
          null,
          null,
          search
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
        data: users,
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
      label: "User mapping",
      url: "/admin/usersMapping",
      isActive: "active",
    });

    const users = await Users.findAll();
    res.render("./moduleMaster/usersMapping/index", {
      title: "Users Mapping",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      users: users,
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
        const id_mapping =
          response.id_mapping == "" ? null : response.id_mapping;
        let insert = await userMappingHelper.UserMapping.create({
          jenis_mapping: response.jenis_mapping,
          id_user: response.id_user,
          id_mapping: id_mapping,
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
        let id_user_mapping = response.id_user_mapping;
        const id_mapping =
          response.id_mapping == "" ? null : response.id_mapping;
        let update = await userMappingHelper.UserMapping.update(
          {
            jenis_mapping: response.jenis_mapping,
            id_user: response.id_user,
            id_mapping: id_mapping,
          },
          {
            where: {
              id_user_mapping: id_user_mapping,
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
  const id_user_mapping = req.params.id_user_mapping;
  const getUserMapping = await userMappingHelper.UserMapping.findOne({
    where: { id_user_mapping: id_user_mapping },
  });
  if (getUserMapping) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data users",
      result: getUserMapping,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data users",
    });
  }
};

const deleteData = async (req, res) => {
  const id_user_mapping = req.params.id_user_mapping;
  const getUserMapping = await userMappingHelper.UserMapping.destroy({
    where: {
      id_user_mapping: id_user_mapping,
    },
  });

  if (getUserMapping) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data users",
      result: getUserMapping,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data users",
    });
  }
};

const selectValueMaping = async (req, res) => {
  const { value, id_mapping } = req.query;
  let data = null;
  let setValueIdMapping = [];
  let getValueMappingDb = null;
  let setSelectDown = [];

  if (value == "pegawai") {
    data = await userMappingHelper.getValueMappingDb(value);
    let index = 0;
    data.map((v, i) => {
      if (id_mapping != v.id_mapping) {
        setValueIdMapping[index] = v.id_mapping;
        index++;
      }
    });
    getValueMappingDb = await getPegawaiNotId(setValueIdMapping);
    getValueMappingDb.map((v, i) => {
      setSelectDown[i] = {
        id_mapping: v.id_pegawai,
        nama_mapping: v.nama_lengkap,
      };
    });
  }
  if (value == "client") {
    data = await userMappingHelper.getValueMappingDb(value);
    let index = 0;
    data.map((v, i) => {
      if (id_mapping != v.id_mapping) {
        setValueIdMapping[index] = v.id_mapping;
        index++;
      }
    });
    getValueMappingDb = await getClientNotId(setValueIdMapping);
    getValueMappingDb.map((v, i) => {
      setSelectDown[i] = {
        id_mapping: v.id_client,
        nama_mapping: v.nama_client,
      };
    });
  }

  if (data != null) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      result: setSelectDown,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Data tidak ada",
    });
  }
};

const getValueUser = async (req, res) => {
  const { value } = req.query;
  const getUsers = await getUsersById(value);

  if (getUsers != null) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      result: getUsers,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Data tidak ada",
    });
  }
};

const getLoadValueMapping = async (req, res) => {
  const { jenis_mapping, id_mapping } = req.query;
  var getDataMappingDb = await userMappingHelper.getDataMapping(
    jenis_mapping,
    id_mapping
  );

  let dataOutput = [];
  if (jenis_mapping == "pegawai") {
    dataOutput = {
      nama_maping: getDataMappingDb.nama_lengkap,
      kontak_maping: getDataMappingDb.no_kontak1,
    };
  }
  if (jenis_mapping == "client") {
    dataOutput = {
      nama_maping: getDataMappingDb.nama_client,
      kontak_maping: getDataMappingDb.kontak,
    };
  }

  if (dataOutput != null) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data",
      result: dataOutput,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Data tidak ada",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
  selectValueMaping,
  getValueUser,
  getLoadValueMapping,
};
