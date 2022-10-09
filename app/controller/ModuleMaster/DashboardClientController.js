const index = async (req, res) => {
  try {
    let client_id = req.query.client_id;
    // breadcrumb
    let breadcrumb = [];
    breadcrumb.push({ label: "Home", url: "/admin/dashboard", isActive: "" });
    breadcrumb.push({
      label: "Client",
      url: "/admin/client",
    });
    breadcrumb.push({
      label: "Dashboard client",
      url: "/admin/dashboardClient?client_id=" + client_id,
      isActive: "active",
    });

    res.render("./moduleMaster/dashboardClient/index", {
      title: "Dashboard Client",
      breadcrumb: breadcrumb,
      currentUrl: req.originalUrl,
      client_id: client_id,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
};
