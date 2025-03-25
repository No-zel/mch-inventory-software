const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("auth", {
  checkToken: () => ipcRenderer.invoke("auth-check"),
});
