const { getPegawaiJadwal } = require("../../helper/pegawaiJadwalHelper");

const index = async (req, res) => {
  try {
    let data = await getPegawaiJadwal(0, 10);

    // breadcrumb
    let breadcrumb = [];
    breadcrumb.push({ label: "Home", url: "/admin/dashboard", isActive: "" });

    breadcrumb.push({
      label: "Pegawai Dashboard",
      url: "/admin/pegawaiDashboard",
      isActive: "active",
    });

    res.render("./modulPegawai/dashboard/index", {
      title: "Dashboard Pegawai",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
};
