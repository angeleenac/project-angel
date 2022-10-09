const express = require("express");
const router = express.Router();

const loginController = require("../controller/LoginController");
const registerController = require("../controller/RegisterController");
const homeController = require("../controller/HomeController");

// login
router.route("/login").get(loginController.index).post(loginController.store);

// register
router.route("/register").get(registerController.index);

router.route("/").get(homeController.index);

module.exports = router;
