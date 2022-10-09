'use strict'

import {app, protocol, BrowserWindow} from 'electron'

const Winstate = require('electron-win-state').default
const path = require('path')

const isDevelopment = process.env.NODE_ENV !== 'production'

// 必须在应用程序准备好之前注册方案
protocol.registerSchemesAsPrivileged([
    {scheme: 'app', privileges: {secure: true, standard: true}}
])


async function createWindow() {
    const winState = new Winstate({
        defaultWidth: 600,
        defaultHeight: 600
    });

    // Create the browser window.
    const home = new BrowserWindow({
        ...winState.winOptions,
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'),
            webSecurity: false,
            // 使用 pluginOptions.nodeIntegration，不要管它
            // 查看 nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration 了解更多信息
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
        }
    })

    await home.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    home.webContents.openDevTools()

    winState.manage(home)
}

// 关闭所有窗口后退出
app.on('window-all-closed', () => {
    // 在 macOS 上，应用程序及其菜单栏很常见
    // 在用户使用 Cmd + Q 明确退出之前保持活动状态
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在 macOS 上，当单击停靠图标并且没有打开其他窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 某些API只有在该事件发生后才能使用。
app.on('ready', async () => {
    createWindow()
})

// 在开发模式下根据父进程的请求干净地退出。
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

