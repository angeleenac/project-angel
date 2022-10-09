const { validationResult } = require("express-validator");
const { userHelper, pagination } = require("../../helper/index");

const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

      let users = await userHelper.getUsers(limit, skip);
      let model = await userHelper.Users.count();
      if (search != null && search != "") {
        users = await userHelper.getUsers(null, null, search, limit);
        let getModel = await userHelper.getUsers(null, null, search);
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
      label: "Users",
      url: "/admin/users",
      isActive: "active",
    });

    res.render("./moduleMaster/users/index", {
      title: "Users",
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
      let dateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      if (response.page == "add") {
        let insert = await userHelper.Users.create({
          username: response.username,
          auth_key: response.auth_key,
          password_hash: bcrypt.hashSync(response.password_hash, saltRounds),
          pin: response.pin,
          email: response.email,
          status: 1,
          created_at: dateTime,
          updated_at: dateTime,
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
        let id = response.id;
        let password_db = response.password_hash_old;
        let password = response.password_hash;
        if (password != null) {
          password_db = bcrypt.hashSync(password, saltRounds);
        }
        let update = await userHelper.Users.update(
          {
            username: response.username,
            auth_key: response.auth_key,
            password_hash: password_db,
            pin: response.pin,
            email: response.email,
            status: response.status,
            updated_at: dateTime,
          },
          {
            where: {
              id: id,
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
  const id = req.params.id;
  const getUsers = await userHelper.Users.findOne({
    where: { id: id },
  });
  if (getUsers) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil mengambil data users",
      result: getUsers,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data users",
    });
  }
};

const deleteData = async (req, res) => {
  const id = req.params.id;
  const getUsers = await userHelper.Users.destroy({
    where: {
      id: id,
    },
  });

  if (getUsers) {
    return res.status(200).json({
      status: 200,
      message: "Berhasil menghapus data users",
      result: getUsers,
    });
  } else {
    return res.status(400).json({
      status: 400,
      message: "Gagal menghapus data users",
    });
  }
};

module.exports = {
  index,
  store,
  edit,
  deleteData,
};
