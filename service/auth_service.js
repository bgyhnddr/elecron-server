let sys_sequelize = require("../dao/sequelize/sys");
let login_util = require("../util/login_util");
let crypto = require("crypto");
const Op = require("sequelize").Op;
let config = require("../config");

exports.login = async (account, password) => {
  password = crypto
    .createHash("md5")
    .update(password)
    .digest("base64");

  let sys_user = sys_sequelize.import("../dao/models/sys/sys_user");
  let sys_role = sys_sequelize.import("../dao/models/sys/sys_role");
  let sys_user_role = sys_sequelize.import("../dao/models/sys/sys_user_role");

  let sys_permission = sys_sequelize.import("../dao/models/sys/sys_permission");

  sys_user.belongsToMany(sys_role, {
    through: sys_user_role
  });

  sys_role.hasMany(sys_permission);

  let sys_user_result = await sys_user.findAll({
    include: [
      {
        model: sys_role,
        include: {
          model: sys_permission
        }
      }
    ],
    where: {
      account: { [Op.eq]: account },
      password: { [Op.eq]: password }
    }
  });

  if (sys_user_result.length == 0) {
    return {
      success: false,
      message: "账号或密码错误"
    };
  }

  let userData = {
    id: sys_user_result[0].id,
    account: sys_user_result[0].account
  };

  userData.permissions = [];

  sys_user_result[0].sys_roles.forEach(role => {
    role.sys_permissions.forEach(permission => {
      userData.permissions.push(permission.permission);
    });
  });

  if (config.admin.indexOf(userData.account) >= 0) {
    let allPermission = [];
    for (let i in config.permissions) {
      allPermission.push(config.permissions[i]);
    }
    userData.permissions = allPermission;
  }

  let token = await login_util.setLoginData(userData);

  return {
    success: true,
    data: {
      token,
      name: userData.account,
      permissions: userData.permissions
    }
  };
};
