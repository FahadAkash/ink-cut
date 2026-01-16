const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  selectFolder: () => ipcRenderer.invoke('dialog:selectFolder'),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  platform: process.platform
});
