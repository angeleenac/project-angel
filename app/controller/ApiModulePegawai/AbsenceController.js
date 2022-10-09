const index = async (req, res) => {
  try {
    console.log(req.body);
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: "Gagal mengambil data",
      result: err,
    });
  }
};

module.exports = {
  index,
};
