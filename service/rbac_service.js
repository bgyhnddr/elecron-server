let sys_sequelize = require("../dao/sequelize/sys");
let login_util = require("../util/login_util");
let config = require("../config");
let crypto = require("crypto");
let strings = require("../strings");
const Op = require("sequelize").Op;

exports.getUsers = async (filterKey, size, page) => {
  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");

  filterKey = filterKey == undefined ? "" : filterKey;
  size = size == undefined ? 10 : parseInt(size);
  page = page == undefined ? 0 : parseInt(page);

  let sys_user_result = await sys_user.findAll({
    where: {
      account: {
        [Op.like]: "%" + filterKey + "%"
      }
    },
    offset: page * size,
    limit: size
  });

  let sys_user_count = await sys_user.count({
    where: {
      account: {
        [Op.like]: "%" + filterKey + "%"
      }
    }
  });

  return {
    success: true,
    data: {
      total: sys_user_count,
      list: sys_user_result.map(o => o.toJSON())
    }
  };
};

exports.addUser = async data => {
  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");

  if (!data.account) {
    return {
      success: false,
      message: strings.account_not_null
    };
  }

  let sys_user_result = await sys_user.findAll({
    where: { account: { [Op.eq]: data.account } }
  });

  if (sys_user_result.length > 0) {
    return {
      success: false,
      message: strings.account_exists
    };
    return;
  }
  data.id = undefined;
  data.password = crypto
    .createHash("md5")
    .update(config.user_default_password)
    .digest("base64");

  await sys_user.create(data);

  return { success: true };
};

exports.editUser = async data => {
  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");
  data.password = crypto
    .createHash("md5")
    .update(data.password)
    .digest("base64");

  await sys_user.update(data, {
    where: {
      id: { [Op.eq]: data.id }
    }
  });

  return { success: true };
};

exports.removeUser = async id => {
  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");
  let sys_user_role = sys_sequelize.import("../dao/models/sys/sys_user_role");

  if (!id) {
    return {
      success: false,
      message: strings.account_not_null
    };
  }

  let t = await sys_sequelize.transaction();
  try {
    await sys_user.destroy({
      where: {
        id: { [Op.eq]: id }
      },
      transaction: t
    });

    await sys_user_role.destroy({
      where: {
        sys_user_id: { [Op.eq]: id }
      },
      transaction: t
    });

    t.commit();
  } catch (e) {
    console.log(e);
    t.rollback();
  }

  return { success: true };
};

exports.getRoles = async () => {
  let sys_role = sys_sequelize.import("../dao/models/sys/sys_role");
  let sys_role_result = await sys_role.findAll();
  return {
    success: true,
    data: {
      list: sys_role_result.map(o => o.toJSON())
    }
  };
};

exports.editRole = async data => {
  let sys_role = sys_sequelize.import("../dao/models/sys/sys_role");

  await sys_role.upsert(data);

  return { success: true };
};

exports.removeRole = async code => {
  let sys_role = sys_sequelize.import("../dao/models/sys/sys_role");
  let sys_user_role = sys_sequelize.import("../dao/models/sys/sys_user_role");
  let sys_permission = sys_sequelize.import("../dao/models/sys/sys_permission");

  let t = await sys_sequelize.transaction();
  try {
    await sys_role.destroy({
      where: {
        code: { [Op.eq]: code }
      },
      transaction: t
    });

    await sys_user_role.destroy({
      where: {
        sys_role_code: { [Op.eq]: code }
      },
      transaction: t
    });

    await sys_permission.destroy({
      where: {
        sys_role_code: { [Op.eq]: code }
      },
      transaction: t
    });

    t.commit();
  } catch (e) {
    console.log(e);
    t.rollback();
  }

  return { success: true };
};

exports.getPermissions = async () => {
  let permissions = [];
  for (let k in config.permissions) {
    permissions.push(config.permissions[k]);
  }

  return {
    success: true,
    data: {
      list: permissions
    }
  };
};

exports.getUserRoles = async id => {
  let sys_user_role = sys_sequelize.import("../dao/models/sys/sys_user_role");

  let sys_user_role_result = await sys_user_role.findAll({
    where: {
      sys_user_id: { [Op.eq]: id }
    }
  });

  return {
    success: true,
    data: {
      list: sys_user_role_result.map(o => o.toJSON())
    }
  };
};

exports.editUserRoles = async (id, roles) => {
  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");
  let sys_role = sys_sequelize.import("../dao/models/sys/sys_role");
  let sys_user_role = sys_sequelize.import("../dao/models/sys/sys_user_role");

  sys_user.belongsToMany(sys_role, {
    through: sys_user_role
  });

  let sys_user_result = await sys_user.findOne({
    include: sys_role,
    where: {
      id: { [Op.eq]: id }
    }
  });

  await sys_user_result.setSys_roles(
    roles.map(o => {
      return sys_role.build({
        code: o.code,
        name: o.name
      });
    })
  );

  return { success: true };
};

exports.getRolePermissions = async code => {
  let sys_permission = sys_sequelize.import("../dao/models/sys/sys_permission");

  let sys_permission_result = await sys_permission.findAll({
    where: {
      sys_role_code: { [Op.eq]: code }
    }
  });

  return {
    success: true,
    data: {
      list: sys_permission_result.map(o => o.toJSON())
    }
  };
};

exports.editRolePermissions = async (code, permissions) => {
  var sys_permission = sys_sequelize.import("../dao/models/sys/sys_permission");
  let t = await sys_sequelize.transaction();
  try {
    await sys_permission.destroy({
      where: {
        sys_role_code: { [Op.eq]: code }
      },
      transaction: t
    });

    await sys_permission.bulkCreate(
      permissions.map(o => {
        return {
          sys_role_code: code,
          permission: o
        };
      }),
      {
        transaction: t
      }
    );

    t.commit();
  } catch (e) {
    t.rollback();
    throw e;
  }

  return { success: true };
};
