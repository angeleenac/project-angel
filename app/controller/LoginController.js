const { Users, getUsersById } = require("../helper/userHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const index = async (req, res) => {
  try {
    // alert session
    const alert = {};
    alert.status = null;
    alert.message = null;

    let message = req.flash("error")[0];
    if (message != null) {
      alert.status = "error";
      alert.message = message;
    }

    message = req.flash("success")[0];
    if (message != null) {
      alert.status = "success";
      alert.message = message;
    }

    res.render("./login/index", {
      layout: "./layouts/home-user",
      title: "Login page",
      alert: alert,
    });
  } catch (err) {
    console.log(err);
  }
};

const store = async (req, res) => {
  try {
    const { username, password } = req.body;
    const checkUsername = await getUsersById(null, username);

    if (checkUsername != null) {
      let hash = checkUsername.password_hash;
      let check = bcrypt.compareSync(password, hash);
      if (check) {
        let jenisMapping = checkUsername.user_mapping.jenis_mapping;
        let idMapping = checkUsername.user_mapping.id_mapping;

        let data = {};
        data.id = checkUsername.id;
        data.jenis_mapping = jenisMapping;
        data.id_mapping = idMapping;

        // json web token
        const token = jwt.sign(
          {
            data: data,
          },
          "code-satu-kantor",
          { expiresIn: "1d" }
        );

        req.session.token = { token: token };
        req.flash(
          "success",
          "Selamat anda berhasil login " + checkUsername.username
        );

        res.redirect("/admin/dashboard");
      } else {
        req.flash("error", "Password salah");
        res.redirect("/login");
      }
    } else {
      req.flash("error", "Username tidak ditemukan");
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  store,
};
