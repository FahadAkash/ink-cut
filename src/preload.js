const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  getFilePath: (file) => webUtils.getPathForFile(file),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  platform: process.platform
});
