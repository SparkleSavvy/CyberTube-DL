
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
   
    fetchVideoInfo: (url) => ipcRenderer.invoke('fetch-info', url),
    downloadVideo: (options) => ipcRenderer.send('download-video', options),

    onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', (_event, value) => callback(value)),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_event, value) => callback(value)),
    onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (_event, value) => callback(value)),

    
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});