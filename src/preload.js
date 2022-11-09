const {contextBridge, ipcRenderer, clipboard} = require('electron');
const fs = require('fs')
const {getShareRss, getShareAdvancedSearch, getDoubanSearch} = require("@/assets/js/http/httpApi");

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('getHttp', {
    getShareRss: (data) => getShareRss(data),
    getShareAdvancedSearch: () => getShareAdvancedSearch(),
    getDoubanSearch: (key) => getDoubanSearch(key)
})

contextBridge.exposeInMainWorld('operate', {
    openWindow: (data) => ipcRenderer.invoke('newWindow', data),
})

contextBridge.exposeInMainWorld('handleData', {
    saveData: (key, value) => ipcRenderer.invoke('saveData', key, value),
    getData: async (key) => await ipcRenderer.invoke('getData', key),
    removeData: async (key) => await ipcRenderer.invoke('removeData', key),
    writeText: (text) => clipboard.writeText(text),
    exportJsonFile: (value) => ipcRenderer.invoke('exportJsonFile', value),
    importJsonFile: async () => {
        let bufferStr = await ipcRenderer.invoke('importJsonFile')
        let bufferOriginal = Buffer.from(JSON.parse(bufferStr).data)
        return bufferOriginal.toString('utf-8')
    },
})

