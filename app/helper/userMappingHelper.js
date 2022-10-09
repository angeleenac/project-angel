const { Op } = require("sequelize");
const { UserMapping, Client, Pegawai, Users } = require("../model/index");

const getUserMapping = async (
  skip = null,
  offset = null,
  search = null,
  limit = null
) => {
  let userMapping = "";
  if (search != null && search != "" && limit != "" && limit != null) {
    userMapping = await UserMapping.findAll({
      attributes: ["id_user_mapping", "jenis_mapping", "id_user", "id_mapping"],
      where: {
        [Op.or]: {
          jenis_mapping: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_user_mapping", "asc"]],
      limit: limit,
    });
  }

  if (skip != null && offset != null) {
    userMapping = await UserMapping.findAll({
      attributes: ["id_user_mapping", "jenis_mapping", "id_user", "id_mapping"],
      order: [["id_user_mapping", "asc"]],
      limit: skip,
      offset: offset,
    });
  }

  if (limit == null && search != null) {
    userMapping = await UserMapping.findAll({
      attributes: ["id_user_mapping", "jenis_mapping", "id_user", "id_mapping"],
      where: {
        [Op.or]: {
          jenis_mapping: {
            [Op.like]: "%" + search + "%",
          },
        },
      },
      order: [["id_user_mapping", "asc"]],
    });
  }
  return userMapping;
};

const getValueMappingDb = async (jenis_mapping = null) => {
  let userMapping = "";
  if (jenis_mapping != null) {
    userMapping = await UserMapping.findAll({
      attributes: ["id_mapping"],
      where: {
        jenis_mapping: jenis_mapping,
      },
      order: [["id_user_mapping", "asc"]],
    });
  }
  return userMapping;
};

const getDataMapping = async (jenis_mapping = null, id_mapping = null) => {
  let userMapping = "";
  if (jenis_mapping == "pegawai") {
    userMapping = await Pegawai.findOne({
      where: {
        id_pegawai: id_mapping,
      },
    });
  }
  if (jenis_mapping == "client") {
    userMapping = await Client.findOne({
      where: {
        id_client: id_mapping,
      },
    });
  }
  return userMapping;
};

const getJoinDataMapping = async (
  jenis_mapping = null,
  id_mapping = null,
  id_user_mapping = null
) => {
  let userMapping = "";

  if (jenis_mapping == "pegawai") {
    console.log("kesini kan betul ga");
    userMapping = await UserMapping.findOne({
      attributes: ["id_user_mapping", "jenis_mapping", "id_user", "id_mapping"],
      where: {
        id_user_mapping: id_user_mapping,
      },
      include: [
        {
          model: Pegawai,
        },
        {
          model: Users,
          attributes: ["id", "username", "auth_key", "pin", "email"],
        },
      ],
    });
  }
  if (jenis_mapping == "client") {
    userMapping = await UserMapping.findOne({
      attributes: ["id_user_mapping", "jenis_mapping", "id_user", "id_mapping"],
      where: {
        id_user_mapping: id_user_mapping,
      },
      include: [
        {
          model: Client,
        },
        {
          model: Users,
        },
      ],
    });
  }
  return userMapping;
};

const getJoinUser = async (id_user = null) => {
  let userMapping = "";
  if (id_user != null) {
    userMapping = UserMapping.findOne({
      where: {
        id_user: id_user,
      },
    });
  }
  return userMapping;
};

module.exports = {
  getUserMapping,
  getValueMappingDb,
  getDataMapping,
  getJoinDataMapping,
  getJoinUser,
  UserMapping,
};
