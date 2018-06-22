const { ipcRenderer, remote } = require('electron')

const request = (channel, args) => {
    return new Promise((resolve) => {
        ipcRenderer.send(channel, args)
        ipcRenderer.once(channel, (e, args) => {
            resolve(args)
        })
    })
}

window.ipcRequest = request
