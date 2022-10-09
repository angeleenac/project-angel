const { Op } = require("sequelize");
const { Users, UserMapping } = require("../model/index");

const getUsers = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let client = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    client = await Users.findAll({
      attributes: ["id", "username", "email", "pin", "status", "auth_key"],
      where: {
        [Op.or]: {
          username: {
            [Op.like]: "%" + search + "%",
          },
          email: {
            [Op.like]: "%" + search + "%",
          },
          pin: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    client = await Users.findAll({
      attributes: ["id", "username", "email", "pin", "status", "auth_key"],
      order: [["id", "asc"]],
      limit: skip,
      offset: offset,
    });
  }

  if (limit == null && search != null) {
    client = await Users.findAll({
      attributes: ["id", "username", "email", "pin", "status", "auth_key"],
      where: {
        [Op.or]: {
          username: {
            [Op.like]: "%" + search + "%",
          },
          email: {
            [Op.like]: "%" + search + "%",
          },
          pin: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id", "asc"]],
    });
  }
  return client;
};

const checkIdentitas = (identitas, page, value, id = null) => {
  let check = "";
  if (page == "add") {
    if (identitas == "username") {
      check = Users.count({
        where: {
          username: value,
        },
      });
    }
  } else {
    if (identitas == "username") {
      check = Users.count({
        where: {
          username: value,
          id: {
            [Op.not]: id,
          },
        },
      });
    }
  }
  return check;
};

const getUsersById = async (
  id_user = null,
  username = null,
  password = null,
  email = null
) => {
  let users = "";
  if (id_user != null) {
    users = Users.findOne({
      where: {
        id: id_user,
      },
    });
  }
  if (username != null) {
    users = Users.findOne({
      where: {
        username: username,
      },
      include: {
        model: UserMapping,
        attributes: [
          "jenis_mapping",
          "id_user",
          "id_mapping",
          "id_user_mapping",
        ],
      },
    });
  }
  if ((username != null) & (password != null)) {
    users = Users.findOne({
      where: {
        username: username,
        password_hash: password,
      },
    });
  }
  if (email != null) {
    users = Users.findOne({
      where: {
        email: email,
      },
      include: {
        model: UserMapping,
        attributes: [
          "jenis_mapping",
          "id_user",
          "id_mapping",
          "id_user_mapping",
        ],
      },
    });
  }
  return users;
};

const getUserEmail = async (email = null, pin = null) => {
  let users = "";
  if (email != null && pin == null) {
    users = await Users.findOne({
      where: {
        email: email,
      },
      include: {
        model: UserMapping,
        attributes: [
          "jenis_mapping",
          "id_user",
          "id_mapping",
          "id_user_mapping",
        ],
      },
    });
  }
  if (email != null && pin != null) {
    users = await Users.findOne({
      where: {
        email: email,
        pin: pin,
      },
      include: {
        model: UserMapping,
        attributes: [
          "jenis_mapping",
          "id_user",
          "id_mapping",
          "id_user_mapping",
        ],
      },
    });
  }
  return users;
};

module.exports = {
  getUsers,
  checkIdentitas,
  getUsersById,
  getUserEmail,
  Users,
};
