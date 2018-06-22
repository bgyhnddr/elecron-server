const sys_mysql = {
  database: "koa_test",
  user: "emp_dev",
  pwd: "Liangyc!@#123",
  options: {
    host: "120.77.83.47",
    dialect: "mysql",
    logging: false,
    pool: {
      max: 100,
      min: 0,
      idle: 10000
    },
    timezone: "+08:00"
  }
};

const sys_sqlite = {
  database: "database",
  options: {
    dialect: "sqlite",
    storage: 'database.sqlite',
    logging: false
  }
};

const redis = {
  host: "localhost",
  port: 6379,
  auth: "redis"
};
exports.sys_mysql = sys_mysql;
exports.sys_sqlite = sys_sqlite
exports.redis = redis;

exports.admin = ["admin"];
exports.server_port = 3000;
exports.user_default_password = "12345";

exports.permissions = require("./permissions");
