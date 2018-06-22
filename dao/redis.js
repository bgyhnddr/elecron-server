if (!global.redis) {
  global.redis = {}
}


const getValue = async key => {
  return global.redis[key]
};
const setValue = async (key, value) => {
  console.log(`set global ${key}: ${value}`)
  global.redis[key] = value
};
const delKey = async key => {
  delete global.redis[key]
};

exports.getValue = getValue;
exports.setValue = setValue;
exports.delKey = delKey;
