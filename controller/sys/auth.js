let auth_service = require("../../service/auth_service");
let strings = require("../../strings");

module.exports = [
  {
    public: true,
    method: "post",
    path: "/sys/login",
    callback: async (args) => {
      let account = args.data.account;
      let password = args.data.password;
      if (!account) {
        return {
          success: false,
          message: strings.account_not_null
        };
      }

      if (!password) {
        return {
          success: false,
          message: strings.password_not_null
        };
      }

      return await auth_service.login(account, password);
    }
  }
];
