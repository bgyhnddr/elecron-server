let Sequelize = require("sequelize");
let config = require("../../config");

const sequelize = new Sequelize(
  config.sys_sqlite.database,
  config.sys_sqlite.user,
  config.sys_sqlite.pwd,
  config.sys_sqlite.options
);

module.exports = sequelize;
