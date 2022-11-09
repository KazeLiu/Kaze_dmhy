import {BrowserWindow, ipcMain} from "electron";
import path from "path";

const Store = require('electron-store');
const store = new Store();

let initIpc = () => {
    ipcMain.on('newWindow', function (e, args) {
        let newWin = new BrowserWindow({
            width: args.width || 900,
            height: args.height || 600,
            minWidth: 500,
            minHeight: 500,
            fullscreen: false, //是否全屏显示
            title: args.name,
            show: false,
            webPreferences: {
                preload: path.resolve(__dirname, 'preload.js'),
                webSecurity: false,
            }
        })
        newWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + args.router + '?showMenu=false')  // 此处写 你要打开的路由地址
        newWin.on('close', () => {
            newWin = null
        })
        newWin.on('ready-to-show', () => {
            newWin.show();
        })
        newWin.webContents.openDevTools()
    })


    console.log(__dirname+'/assets/html/')

    ipcMain.on('download', function (e, args) {
        let newWin = new BrowserWindow({
            width: 900,
            height: 600,
            minWidth: 500,
            minHeight: 500,
            fullscreen: false, //是否全屏显示
            title: "下载",
            show: false,
        })
        newWin.file(__dirname+'/assets/html/')  // 此处写 你要打开的路由地址
        newWin.on('close', () => {
            newWin = null
        })
        newWin.on('ready-to-show', () => {
            newWin.show();
        })
    })

    ipcMain.handle('saveData', function (e, args) {
        // console.log('存值', args)
        store.set(args.key, args.value);
    })

    ipcMain.handle('getData', function (e, args) {
        let data = store.get(args)
        // console.log('取值', args, data)
        return data
    })

    ipcMain.handle('removeData', function (e, args) {
        let data = store.delete(args)
        // console.log('删除', args, data)
        return data
    })
}

export {initIpc}
