const { contextBridge, ipcRenderer,ipcMain } = require('electron');
const {getTagBangumi, getKey, getTeam, getList} = require("@/assets/js/http/httpApi");

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('getData', {
    getList: (data) => getList(data),
    getTeam: (data) => getTeam(data),
    getKey: (data) => getKey(data),
    getTagBangumi:(data)=>getTagBangumi(data),
})

contextBridge.exposeInMainWorld('operate', {
    openWindow: (data) => ipcRenderer.send('newWindow',data),
})