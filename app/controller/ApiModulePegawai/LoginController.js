const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  getUsersById,
  getUserEmail,
  Users,
} = require("../../helper/userHelper");

const { main } = require("../../config/gmail");
const { randomOtpNumber } = require("../../utils/index");
const moment = require("moment");
require("dotenv").config();

const index = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkEmail = await getUsersById(null, null, null, email);

    if (checkEmail != null) {
      let hash = checkEmail.password_hash;
      let check = bcrypt.compareSync(password, hash);

      if (check) {
        let random = randomOtpNumber();
        let id_user = checkEmail.id;
        let durasi = 1;
        let tanggalPlusOneMinute = moment()
          .add(durasi, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");

        let output = {};
        output.random = random;
        output.email = email;
        output.estimasi = tanggalPlusOneMinute;
        output.durasi = durasi;

        let response = await main(output);
        if (response) {
          let data = {};
          data.pin = output.random;
          data.updated_at = output.estimasi;

          Users.update(data, {
            where: {
              id: id_user,
            },
          });

          return res.status(200).json({
            status: 200,
            message: "Kode OTP terkirim ke email anda",
          });
        } else {
          return res.status(400).json({
            status: 400,
            message: "Gagal login OTP",
          });
        }
      } else {
        res.status(400).json({
          status: 400,
          message: "Password anda salah",
          result: err,
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Username tidak ditemukan",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: "Terjadi kesalahan",
      result: err,
    });
  }
};

const verify = async (req, res) => {
  const { email, pin } = req.body;

  const checkData = await getUserEmail(email, pin);
  if (checkData != null) {
    let dateNow = moment();
    let dateTo = moment(checkData.updated_at);
    let diff = moment.duration(dateTo.diff(dateNow)).asDays();
    if (diff > 0) {
      let jenis_mapping = checkData.user_mapping.jenis_mapping;
      let id_mapping = checkData.user_mapping.id_mapping;
      let id_user_mapping = checkData.user_mapping.id_user_mapping;

      let data = {};
      data.id = checkData.id;
      data.jenis_mapping = jenis_mapping;
      data.id_mapping = id_mapping;
      data.id_user_mapping = id_user_mapping;

      // json web token
      const token = jwt.sign(
        {
          data: data,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        status: 200,
        message: "Berhasil verifikasi kode otp",
        resutl: token,
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Waktu verifikasi OTP sudah berakhir",
      });
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: "Kesalahan OTP",
    });
  }
};

const sendOtpRedo = async (req, res) => {
  const { email } = req.body;

  const checkData = await getUserEmail(email);
  let id_user = checkData.id;

  if (checkData != null) {
    let random = randomOtpNumber();

    let durasi = 1;
    let tanggalPlusOneMinute = moment()
      .add(durasi, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    let output = {};
    output.random = random;
    output.email = email;
    output.estimasi = tanggalPlusOneMinute;
    output.durasi = durasi;

    let response = await main(output);
    if (response) {
      let data = {};
      data.pin = output.random;
      data.updated_at = output.estimasi;

      Users.update(data, {
        where: {
          id: id_user,
        },
      });

      return res.status(200).json({
        status: 200,
        message: "Kode OTP terkirim ke email anda",
      });
    } else {
      return res.status(400).json({
        status: 400,
        message: "Gagal login OTP",
      });
    }
  } else {
    return res.status(400).json({
      status: 400,
      message: "Email tidak ditemukan",
    });
  }
};

module.exports = {
  index,
  verify,
  sendOtpRedo,
};
