'use strict'

import {app, protocol, BrowserWindow, ipcMain} from 'electron'
import {initIpc} from '@/assets/js/control/backgroundHelper'

const WinState = require('electron-win-state').default
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'


// 必须在应用程序准备好之前注册方案
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])


async function createWindow() {
    // 主页面窗口状态
    const homeState = new WinState({
        defaultWidth: 1100, defaultHeight: 800
    });

    // 主窗口内容
    const home = new BrowserWindow({
        ...homeState.winOptions, webPreferences: {
            preload: path.resolve(__dirname, 'preload.js'), webSecurity: false,
        }
    })

    // 主窗口访问的vue地址
    await home.loadURL(process.env.WEBPACK_DEV_SERVER_URL)

    // 打开主窗口控制台
    home.webContents.openDevTools()

    // 将状态设置到主窗口
    homeState.manage(home)

    initIpc();
}

// 关闭所有窗口后退出
app.on('window-all-closed', () => {
    // 在 macOS 上，应用程序及其菜单栏很常见
    // 在用户使用 Cmd + Q 明确退出之前保持活动状态
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', async () => {
    // 在 macOS 上，当单击停靠图标并且没有打开其他窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        await createWindow()
    }
})

// 当 Electron 完成初始化并准备创建浏览器窗口时，将调用此方法。
// 某些API只有在该事件发生后才能使用。
app.on('ready', async () => {
    await createWindow()
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
