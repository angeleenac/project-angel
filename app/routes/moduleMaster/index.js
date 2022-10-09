const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  pegawaiHelper,
  userHelper,
  jabatanHelper,
  unitHelper,
} = require("../../helper/index");

const dashboardController = require("../../controller/ModuleMaster/DashboardController");
const clientController = require("../../controller/ModuleMaster/ClientController");
const jadwalController = require("../../controller/ModuleMaster/JadwalController");
const dashboardClientController = require("../../controller/ModuleMaster/DashboardClientController");
const cabangController = require("../../controller/ModuleMaster/CabangController");
const unitController = require("../../controller/ModuleMaster/UnitController");
const pegawaiController = require("../../controller/ModuleMaster/PegawaiController");
const jabatanController = require("../../controller/ModuleMaster/JabatanController");
const jenisAbsensiController = require("../../controller/ModuleMaster/JenisAbsensiController");
const jenisCutiController = require("../../controller/ModuleMaster/JenisCutiController");
const jenisLemburController = require("../../controller/ModuleMaster/JenisLemburController");
const komponenGajiController = require("../../controller/ModuleMaster/KomponenGajiController");
const langgananController = require("../../controller/ModuleMaster/LanggananController");
const usersController = require("../../controller/ModuleMaster/UsersController");
const usersMappingController = require("../../controller/ModuleMaster/UsersMappingController");
const pegawaiJadwalController = require("../../controller/ModulePegawai/PegawaiJadwalController");
const pegawaiDashboardController = require("../../controller/ModulePegawai/PegawaiDashboardController");
const pengajuanCutiController = require("../../controller/ModuleMaster/PengajuanCutiController");
const taskTrackingController = require("../../controller/ModuleMaster/TaskTrackingController");

// dashboard
router.route("/dashboard").get(dashboardController.index);

// pegawai
// router.route("/pegawai").get(index);

// client
router
  .route("/client")
  .get(clientController.index)
  .post(
    body("nama_client")
      .notEmpty()
      .withMessage("Nama client wajib diisi")
      .trim(),
    body("alamat").notEmpty().withMessage("Alamat wajib disii").trim(),
    body("kontak")
      .notEmpty()
      .withMessage("Kontak wajib diisi")
      .trim()
      .isNumeric()
      .withMessage("Wajib berupa angka"),
    clientController.store
  );
router.route("/client/:id_client/edit").get(clientController.edit);
router.route("/client/:id_client/delete").get(clientController.deleteData);

// dashboard client
router.route("/dashboardClient").get(dashboardClientController.index);

// jadwal
router
  .route("/jadwal")
  .get(jadwalController.index)
  .post(
    body("waktu_masuk")
      .notEmpty()
      .withMessage("Waktu masuk wajib diisi")
      .trim(),
    body("waktu_keluar").notEmpty().withMessage("Waktu keluar disii").trim(),
    body("warna").notEmpty().withMessage("Warna wajib diisi").trim(),
    body("jenis").notEmpty().withMessage("Jenis wajib diisi").trim(),
    jadwalController.store
  );
router.route("/jadwal/:id_jadwal/edit").get(jadwalController.edit);
router.route("/jadwal/:id_jadwal/delete").get(jadwalController.deleteData);

// cabang
router
  .route("/cabang")
  .get(cabangController.index)
  .post(
    body("nama_cabang")
      .notEmpty()
      .withMessage("Nama cabang wajib diisi")
      .trim(),
    body("alamat").notEmpty().withMessage("Alamat wajib disii").trim(),
    body("kontak")
      .notEmpty()
      .withMessage("Kontak wajib diisi")
      .trim()
      .isNumeric()
      .withMessage("Wajib berupa angka"),
    cabangController.store
  );
router.route("/cabang/:id_cabang/edit").get(cabangController.edit);
router.route("/cabang/:id_cabang/delete").get(cabangController.deleteData);

// unit
router
  .route("/unit")
  .get(unitController.index)
  .post(
    body("id_cabang").notEmpty().withMessage("Cabang wajib diisi").trim(),
    body("nama_unit").notEmpty().withMessage("Unit wajib diisi").trim(),
    body("membawahi_unit").custom(async (value, meta) => {
      let check = await unitHelper.Unit.count();
      if (check > 0) {
        if (value == "" || value == null) {
          return Promise.reject("Membawahi unit wajib diisi");
        }
      }
    }),
    unitController.store
  );
router.route("/unit/:id_unit/edit").get(unitController.edit);
router.route("/unit/:id_unit/delete").get(unitController.deleteData);
router.route("/unit/getFindInUnit").get(unitController.getFindInUnit);
router.route("/unit/getFindAllUnit").get(unitController.getFindAllUnit);

// pegawai
router
  .route("/pegawai")
  .get(pegawaiController.index)
  .post(
    body("no_identitas")
      .notEmpty()
      .withMessage("No. identitas tidak boleh kosong")
      .trim()
      .isLength({ max: 20 })
      .withMessage("Jenis identitas maksimal 20 karakter"),
    body("no_identitas").custom(async (value, meta) => {
      const { page, id_pegawai } = meta.req.body;
      if (page == "add") {
        let check = await pegawaiHelper.checkIdentitas(
          "no_identitas",
          page,
          value
        );
        if (check > 0) {
          return Promise.reject("No identitas ini sudah digunakan");
        }
      }
      if (page == "edit") {
        let check = await pegawaiHelper.checkIdentitas(
          "no_identitas",
          page,
          value,
          id_pegawai
        );
        if (check > 0) {
          return Promise.reject("No identitas ini sudah digunakan");
        }
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
      const { page, id_pegawai } = meta.req.body;
      if (page == "add") {
        let check = await pegawaiHelper.checkIdentitas(
          "no_pegawai",
          page,
          value
        );
        if (check > 0) {
          return Promise.reject("No. pegawai ini sudah digunakan");
        }
      }
      if (page == "edit") {
        let check = await pegawaiHelper.checkIdentitas(
          "no_pegawai",
          page,
          value,
          id_pegawai
        );
        if (check > 0) {
          return Promise.reject("No. pegawai ini sudah digunakan");
        }
      }
    }),
    body("tanggal_masuk")
      .notEmpty()
      .withMessage("Tanggal masuk tidak boleh kosong"),
    body("tanggal_keluar")
      .notEmpty()
      .withMessage("Tanggal keluar tidak boleh kosong"),
    pegawaiController.store
  );
router.route("/pegawai/:id_pegawai/edit").get(pegawaiController.edit);
router.route("/pegawai/:id_pegawai/delete").get(pegawaiController.deleteData);

// jabatan
router
  .route("/jabatan")
  .get(jabatanController.index)
  .post(
    body("id_unit").notEmpty().withMessage("Unit wajib diisi").trim(),
    body("nama_jabatan").notEmpty().withMessage("Jabatan wajib diisi").trim(),
    body("membawahi_jabatan").custom(async (value, meta) => {
      let check = await jabatanHelper.Jabatan.count();
      if (check > 0) {
        if (value == "" || value == null) {
          return Promise.reject("Membawahi jabatan wajib diisi");
        }
      }
    }),
    jabatanController.store
  );
router.route("/jabatan/:id_jabatan/edit").get(jabatanController.edit);
router.route("/jabatan/:id_jabatan/delete").get(jabatanController.deleteData);
router
  .route("/jabatan/getFindInJabatan")
  .get(jabatanController.getFindInJabatan);
router
  .route("/jabatan/getFindAllJabatan")
  .get(jabatanController.getFindAllJabatan);

// jenisAbsensi
router
  .route("/jenisAbsensi")
  .get(jenisAbsensiController.index)
  .post(
    body("jenis_absensi")
      .notEmpty()
      .withMessage("Jenis absensi wajib diisi")
      .trim(),
    jenisAbsensiController.store
  );
router
  .route("/jenisAbsensi/:id_jenis_absensi/edit")
  .get(jenisAbsensiController.edit);
router
  .route("/jenisAbsensi/:id_jenis_absensi/delete")
  .get(jenisAbsensiController.deleteData);

// jenisCuti
router
  .route("/jenisCuti")
  .get(jenisCutiController.index)
  .post(
    body("jenis_cuti").notEmpty().withMessage("Jenis cuti wajib diisi").trim(),
    body("saldo").notEmpty().withMessage("Saldo wajib diisi").trim(),
    jenisCutiController.store
  );
router.route("/jenisCuti/:id_jenis_cuti/edit").get(jenisCutiController.edit);
router
  .route("/jenisCuti/:id_jenis_cuti/delete")
  .get(jenisCutiController.deleteData);

// jenisLembur
router
  .route("/jenisLembur")
  .get(jenisLemburController.index)
  .post(
    body("jenis_lembur")
      .notEmpty()
      .withMessage("Jenis lembur wajib diisi")
      .trim(),
    body("jenis_jadwal")
      .notEmpty()
      .withMessage("Jenis jadwal wajib diisi")
      .trim(),
    body("jenis_perhitungan")
      .notEmpty()
      .withMessage("Jenis perhitungan wajib diisi")
      .trim(),
    body("formula").notEmpty().withMessage("Formula wajib diisi").trim(),
    jenisLemburController.store
  );
router
  .route("/jenisLembur/:id_jenis_lembur/edit")
  .get(jenisLemburController.edit);
router
  .route("/jenisLembur/:id_jenis_lembur/delete")
  .get(jenisLemburController.deleteData);

// komponenGaji
router
  .route("/komponenGaji")
  .get(komponenGajiController.index)
  .post(
    body("komponen_gaji")
      .notEmpty()
      .withMessage("Komponen gaji wajib diisi")
      .trim(),
    body("jenis").notEmpty().withMessage("Jenis wajib diisi").trim(),
    body("jenis")
      .isLength({
        max: 5,
      })
      .withMessage("Jenis harus 5 karakter")
      .trim(),
    body("kelompok_komponen")
      .notEmpty()
      .withMessage("Kelompok komponen wajib diisi")
      .trim()
      .isLength({
        max: 50,
      })
      .withMessage("Kelompok komponen harus 50 karakter"),
    body("komponen").notEmpty().withMessage("Formula wajib diisi").trim(),
    komponenGajiController.store
  );
router
  .route("/komponenGaji/:id_komponen_gaji/edit")
  .get(komponenGajiController.edit);
router
  .route("/komponenGaji/:id_komponen_gaji/delete")
  .get(komponenGajiController.deleteData);

// langganan
router
  .route("/langganan")
  .get(langgananController.index)
  .post(
    body("waktu_mulai")
      .notEmpty()
      .withMessage("Waktu mulai wajib diisi")
      .trim(),
    body("waktu_selesai")
      .notEmpty()
      .withMessage("Waktu selesai wajib diisi")
      .trim(),
    body("id_client").notEmpty().withMessage("Client wajib diisi").trim(),
    langgananController.store
  );
router.route("/langganan/:id_langganan/edit").get(langgananController.edit);
router
  .route("/langganan/:id_langganan/delete")
  .get(langgananController.deleteData);

// users
router
  .route("/users")
  .get(usersController.index)
  .post(
    body("username").custom(async (value, meta) => {
      const { page, id } = meta.req.body;
      if (page == "add") {
        let check = await userHelper.checkIdentitas("username", page, value);
        if (check > 0) {
          return Promise.reject("Username ini sudah digunakan");
        }
      }
      if (page == "edit") {
        let check = await userHelper.checkIdentitas(
          "username",
          page,
          value,
          id
        );
        if (check > 0) {
          return Promise.reject("Username ini sudah digunakan");
        }
      }
    }),
    body("auth_key").notEmpty().withMessage("Auth key wajib diisi").trim(),
    body("password_hash").custom(async (value, meta) => {
      const { page, confirm_password_hash } = meta.req.body;
      if (page == "add") {
        if (value == null) {
          return Promise.reject("Password wajib diisi");
        }

        if (value != null && confirm_password_hash != null) {
          if (value != confirm_password_hash) {
            return Promise.reject(
              "Password tidak sama dengan confirm password"
            );
          }
        }
      }
      if (page == "edit") {
        if (value != null && confirm_password_hash != null) {
          if (value != confirm_password_hash) {
            return Promise.reject(
              "Password tidak sama dengan confirm password"
            );
          }
        }
      }
    }),
    body("email")
      .notEmpty()
      .withMessage("Email wajib diisi")
      .trim()
      .isEmail()
      .withMessage("Email tidak valid"),
    body("pin")
      .notEmpty()
      .withMessage("Pin wajib diisi")
      .trim()
      .isLength(6)
      .withMessage("Pin maximal 6 karakter")
      .isNumeric()
      .withMessage("Pin wajib berupa angka"),
    usersController.store
  );
router.route("/users/:id/edit").get(usersController.edit);
router.route("/users/:id/delete").get(usersController.deleteData);

// usersMapping
router
  .route("/usersMapping")
  .get(usersMappingController.index)
  .post(
    body("jenis_mapping")
      .notEmpty()
      .withMessage("Jenis mapping wajib diisi")
      .trim(),
    body("id_user").notEmpty().withMessage("Id user wajib diisi").trim(),
    body("id_mapping").custom(async (value, meta) => {
      const { jenis_mapping } = meta.req.body;
      if (jenis_mapping == "pegawai") {
        if (value == null) {
          return Promise.reject("Mapping wajib diisi");
        }
      }
      if (jenis_mapping == "client") {
        if (value == null) {
          return Promise.reject("Mapping wajib diisi");
        }
      }
    }),
    usersMappingController.store
  );
router
  .route("/usersMapping/:id_user_mapping/edit")
  .get(usersMappingController.edit);
router
  .route("/usersMapping/:id_user_mapping/delete")
  .get(usersMappingController.deleteData);
router
  .route("/usersMapping/selectValueMaping")
  .get(usersMappingController.selectValueMaping);
router
  .route("/usersMapping/getValueUser")
  .get(usersMappingController.getValueUser);
router
  .route("/usersMapping/getLoadValueMapping")
  .get(usersMappingController.getLoadValueMapping);

// pegawaiDashboard
router.route("/pegawaiDashboard").get(pegawaiDashboardController.index);

// pegawaiJadwal
router
  .route("/pegawaiJadwal")
  .get(pegawaiJadwalController.index)
  .post(
    body("id_pegawai").notEmpty().withMessage("Pegawai wajib diisi").trim(),
    body("id_jadwal").notEmpty().withMessage("Jadwal wajib diisi").trim(),
    body("tanggal").notEmpty().withMessage("Tanggal wajib diisi").trim(),
    pegawaiJadwalController.store
  );
router
  .route("/pegawaiJadwal/:id_pegawai_jadwal/edit")
  .get(pegawaiJadwalController.edit);
router
  .route("/pegawaiJadwal/:id_pegawai_jadwal/delete")
  .get(pegawaiJadwalController.deleteData);

// pengajuan cuti
router
  .route("/pengajuanCuti")
  .get(pengajuanCutiController.index)
  .post(
    body("tanggal_awal_cuti")
      .notEmpty()
      .withMessage("Tanggal awal cuti wajib diisi")
      .trim(),
    body("tanggal_awal_cuti")
      .notEmpty()
      .withMessage("Tanggal akhir cuti wajib diisi")
      .trim(),
    pengajuanCutiController.store
  );
router.route("/pengajuanCuti/:id_pengajuan_cuti/edit").get(pengajuanCutiController.edit);
router
  .route("/pengajuanCuti/:id_pengajuan_cuti/delete")
  .get(pengajuanCutiController.deleteData);

//Task Tracking
router.route("/taskTracking").get(taskTrackingController.index);

module.exports = router;
