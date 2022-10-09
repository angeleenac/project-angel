const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const pegawaiJadwalController = require("../../controller/ModulePegawai/PegawaiJadwalController");
const pegawaiDashboardController = require("../../controller/ModulePegawai/PegawaiDashboardController");

// pegawaiDashboard
router.route("/pegawaiDashboard").get(pegawaiDashboardController.index);

// pegawaiJadwal
router
  .route("/pegawaiJadwal")
  .get(pegawaiJadwalController.index)
  .post(
    body("id_pegawai").notEmpty().withMessage("Pegawai wajib diisi").trim(),
    body("id_jadwal").notEmpty().withMessage("Jadwal wajib diisi").trim(),
    body("id_jenis_absensi")
      .notEmpty()
      .withMessage("Jenis absensi diisi")
      .trim(),
    body("tanggal").notEmpty().withMessage("Tanggal wajib diisi").trim(),
    pegawaiJadwalController.store
  );
router
  .route("/pegawaiJadwal/:id_pegawai_jadwal/edit")
  .get(pegawaiJadwalController.edit);
router
  .route("/pegawaiJadwal/:id_pegawai_jadwal/delete")
  .get(pegawaiJadwalController.deleteData);

module.exports = router;
