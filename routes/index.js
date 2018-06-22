let permission_util = require("../util/permission_util");
let strings = require("../strings");

const { ipcMain } = require('electron')


let initRouter = path => {
  let controllers = require(path);
  controllers.forEach(controller => {
    bindController(controller);
  });
};

let bindController = controller => {
  console.log(`start ${controller.path}`);
  ipcMain.on(controller.path, (event, args) => {
    controllerHandle(args, controller).then((result) => {
      event.sender.send(controller.path, result)
    }).catch(e => {
      console.log(e)
      event.sender.send(controller.path, {
        success: false,
        message: e.message
      })
    });
  })
};

let controllerHandle = async (args, controller) => {
  let checked = await permission_util.checkPermission(
    args.token,
    controller
  );

  if (checked.check) {
    return await controller.callback(args);
  } else {
    if (checked.message == strings.not_login) {
      return {
        success: false,
        code: "notlogin",
        message: checked.message
      };
    } else {
      return {
        success: false,
        message: checked.message
      };
    }
  }
};

initRouter("../controller/sys/auth");
initRouter("../controller/sys/rbac");
