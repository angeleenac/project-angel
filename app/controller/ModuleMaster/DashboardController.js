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

    res.render("./moduleMaster/dashboard/index", {
      title: "Dashboard page",
      currentUrl: req.originalUrl,
      alert: alert,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
};
