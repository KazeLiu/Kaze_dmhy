const {contextBridge, ipcRenderer} = require('electron');
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
    getTagBangumi: (data) => getTagBangumi(data),
})

contextBridge.exposeInMainWorld('operate', {
    openWindow: (data) => ipcRenderer.invoke('newWindow', data),
})

contextBridge.exposeInMainWorld('handleData', {
    saveData: (key, value) => ipcRenderer.invoke('saveData', key, value),
    getData: async (key) => await ipcRenderer.invoke('getData', key),
    removeData: async (key) => await ipcRenderer.invoke('removeData', key)
})