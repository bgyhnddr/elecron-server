let fs = require("fs");
let config = require("../config")
let rbac = require("../service/rbac_service")


if (!fs.existsSync(config.sys_sqlite.options.storage)) {
    require("../dao/script/init_sys_models").run().then(() => {
        rbac.addUser({ account: "admin", password: "12345" })
    });
}
else {
    console.log("database exists")
}
