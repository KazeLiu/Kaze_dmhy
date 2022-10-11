import {BrowserWindow, ipcMain} from "electron";


export let getWindow = (id) => {
    return BrowserWindow.fromId(id);
}
