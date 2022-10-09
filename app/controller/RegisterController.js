const index = async (req, res) => {
  try {
    res.render("./register/index");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  index,
};
