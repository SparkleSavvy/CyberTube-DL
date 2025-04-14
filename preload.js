// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // --- Functions callable from Renderer (index.html) ---
    fetchVideoInfo: (url) => ipcRenderer.invoke('fetch-info', url),
    downloadVideo: (options) => ipcRenderer.send('download-video', options),

    // --- Listeners for events from Main process ---
    onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', (_event, value) => callback(value)),
    onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (_event, value) => callback(value)),
    onDownloadComplete: (callback) => ipcRenderer.on('download-complete', (_event, value) => callback(value)),

    // --- Cleanup (Optional but good practice) ---
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});