let fs = require("fs");
let path = require("path");
let sequelize = require("../sequelize/sys");

let getModels = tables => {
  let models = fs.readdirSync(path.join(__dirname, "../models/sys"));
  console.log(models);
  if (tables) {
    models = models.filter(o => tables.indexOf(o) >= 0);
  }

  return models.map(o => {
    return "../models/sys/" + o;
  });
};

let run = async tables => {
  let models = getModels(tables);
  for (let i = 0; i < models.length; i++) {
    var model = sequelize.import(models[i]);
    await model.sync({ alter: true });
  }
  console.log("done");
};

exports.run = run;
