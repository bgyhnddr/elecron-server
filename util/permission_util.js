let login_util = require("./login_util");
let strings = require("../strings");
let config = require("../config");

exports.checkPermission = async (token, controller) => {
  if (controller.public) {
    return {
      check: true
    };
  }

  let userData = await login_util.getLoginData(token);
  if (userData) {
    if (
      !controller.permissions ||
      config.admin.indexOf(userData.account) >= 0
    ) {
      return {
        check: true
      };
    }

    return {
      check: userData.permissions.some(o => {
        return controller.permissions.indexOf(o) >= 0;
      }),
      message: strings.no_permission
    };
  } else {
    return {
      check: false,
      message: strings.not_login
    };
  }
};
