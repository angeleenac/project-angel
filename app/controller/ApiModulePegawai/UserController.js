const { validationResult } = require("express-validator");
const usersModel = require("../../helper/userHelper");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const index = async (req, res) => {
  try {
    let user = req.user.data;
    let getUserById = await usersModel.getUsersById(user.id);
    if (getUserById) {
      return res.status(200).json({
        status: 200,
        message: "Berhasil tangkap data",
        result: getUserById,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal mengambil data",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data",
      result: err,
    });
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
      const { body } = req;
      let user = req.user.data;
      let password_db = body.password_hash_old;
      let password = body.password_hash;
      if (password != null) {
        password_db = bcrypt.hashSync(password, saltRounds);
      }
      let update = await usersModel.Users.update(
        {
          username: body.username,
          auth_key: body.auth_key,
          password_hash: password_db,
          email: body.email,
        },
        {
          where: {
            id: user.id,
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
  } catch (error) {
    console.log("terjadi kesalahan", error);
    return res.status(400).json({
      status: 400,
      message: "Terjadi kesalahan",
      result: error,
    });
  }
};

module.exports = {
  index,
  store,
};
