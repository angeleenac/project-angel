const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { protect } = require("../../middleware");

// controller
const loginController = require("../../controller/ApiModulePegawai/LoginController");
const profileController = require("../../controller/ApiModulePegawai/ProfileController");
const userController = require("../../controller/ApiModulePegawai/UserController");
const homeController = require("../../controller/ApiModulePegawai/HomeController");
const absenceController = require("../../controller/ApiModulePegawai/AbsenceController");

// helper
const { pegawaiHelper, userHelper } = require("../../helper/index");

// api login
router.route("/login").post(loginController.index);
router.route("/login/verify").post(loginController.verify);
router.route("/login/sendOtpRedo").post(loginController.sendOtpRedo);

// api profile
router
  .route("/profile")
  .get(protect, profileController.index)
  .put(
    protect,
    body("no_identitas")
      .notEmpty()
      .withMessage("No. identitas tidak boleh kosong")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Jenis identitas maksimal 20 karakter"),
    body("no_identitas").custom(async (value, meta) => {
      let user = meta.req.user.data;
      const id_pegawai = user.id_mapping;

      let check = await pegawaiHelper.checkIdentitas(
        "no_identitas",
        "edit",
        value,
        id_pegawai
      );
      if (check > 0) {
        return Promise.reject("No identitas ini sudah digunakan");
      }
    }),
    body("nama_lengkap")
      .notEmpty()
      .withMessage("Nama lengkap tidak boleh kosong")
      .trim(),
    body("jenis_identitas")
      .notEmpty()
      .withMessage("Jenis identitas tidak boleh kosong")
      .isLength({ max: 10 })
      .withMessage("Jenis identitas maksimal 10 karakter"),
    body("jenis_kelamin")
      .notEmpty()
      .withMessage("Jenis kelamin tidak boleh kosong"),
    body("tempat_lahir")
      .notEmpty()
      .withMessage("Tempat lahir tidak boleh kosong"),
    body("tanggal_lahir")
      .notEmpty()
      .withMessage("Tanggal lahir tidak boleh kosong"),
    body("status_perkawinan")
      .notEmpty()
      .withMessage("Status perkawinan tidak boleh kosong"),
    body("agama").notEmpty().withMessage("Agama tidak boleh kosong"),
    body("pendidikan").notEmpty().withMessage("Pendidikan tidak boleh kosong"),
    body("alamat_domisili")
      .notEmpty()
      .withMessage("Alamat domisili tidak boleh kosong"),
    body("alamat_ktp").notEmpty().withMessage("Alamat KTP tidak boleh kosong"),
    body("no_kontak1")
      .notEmpty()
      .withMessage("No. kontak tidak boleh kosong")
      .isInt()
      .withMessage("No. kontak wajib angka")
      .isLength({ max: 15 })
      .withMessage("Jenis identitas maksimal 15 karakter"),
    body("email")
      .notEmpty()
      .withMessage("Email tidak boleh kosong")
      .isEmail()
      .withMessage("Email tidak valid"),
    body("no_pegawai")
      .notEmpty()
      .withMessage("No. pegawai tidak boleh kosong")
      .isInt()
      .withMessage("No pegawai wajib angka")
      .isLength({ max: 25 })
      .withMessage("Jenis identitas maksimal 25 karakter"),
    body("no_pegawai").custom(async (value, meta) => {
      let user = meta.req.user.data;
      const id_pegawai = user.id_mapping;

      let check = await pegawaiHelper.checkIdentitas(
        "no_pegawai",
        "edit",
        value,
        id_pegawai
      );
      if (check > 0) {
        return Promise.reject("No. pegawai ini sudah digunakan");
      }
    }),
    body("tanggal_masuk")
      .notEmpty()
      .withMessage("Tanggal masuk tidak boleh kosong"),
    profileController.store
  );

// api user
router
  .route("/user")
  .get(protect, userController.index)
  .put(
    protect,
    body("username").custom(async (value, meta) => {
      let user = meta.req.user.data;
      const id_user = user.id;
      let check = await userHelper.checkIdentitas(
        "username",
        "edit",
        value,
        id_user
      );
      if (check > 0) {
        return Promise.reject("Username ini sudah digunakan");
      }
    }),
    body("auth_key").notEmpty().withMessage("Auth key wajib diisi").trim(),
    body("password_hash").custom(async (value, meta) => {
      const { confirm_password_hash } = meta.req.body;
      if (value != null && confirm_password_hash != null) {
        if (value != confirm_password_hash) {
          return Promise.reject("Password tidak sama dengan confirm password");
        }
      }
    }),
    body("email")
      .notEmpty()
      .withMessage("Email wajib diisi")
      .trim()
      .isEmail()
      .withMessage("Email tidak valid"),
    userController.store
  );

// api home
router.route("/home").get(protect, homeController.index);

// api absence
router.route("/absence").get(protect, absenceController.index);

module.exports = router;
