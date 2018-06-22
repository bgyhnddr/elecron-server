let redis = require("../dao/redis");
let uuid = require("node-uuid");

exports.setLoginData = async user => {
  let token = uuid.v4();
  let userData = await redis.getValue(user.id);
  if (userData) {
    userData = JSON.parse(userData);
    await redis.delKey(userData.token);
    await redis.delKey(user.id);
  }

  await redis.setValue(token, user.id);
  await redis.setValue(
    user.id,
    JSON.stringify({
      token: token,
      data: user
    })
  );
  return token;
};

exports.getLoginData = async token => {
  let id = await redis.getValue(token);
  if (id) {
    let userData = await redis.getValue(id);
    return JSON.parse(userData).data;
  }
};
