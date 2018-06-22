const { app, BrowserWindow, globalShortcut } = require('electron')
let path = require("path")

require("./build/init_db")
require("./routes")


function createWindow() {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 800, height: 600, webPreferences: {
            preload: path.join(__dirname, 'preload/window_sdk.js')
        }
    })

    // 然后加载应用的 index.html。
    win.loadFile('web/index.html')
    // win.loadURL('http://localhost:8080')
    win.maximize()


    globalShortcut.register('CommandOrControl+Alt+I', function () {
        win.webContents.openDevTools()
    })

    app.on('window-all-closed', () => {
        app.quit()
    })
}

app.on('ready', createWindow)