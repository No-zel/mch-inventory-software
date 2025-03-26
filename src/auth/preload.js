const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  request: async ({ method, url, body = {} }) => {
    return await ipcRenderer.invoke("APIRequest", { method, url, body });
  },
});



// const { contextBridge, ipcRenderer } = require("electron");

// contextBridge.exposeInMainWorld("auth", {
//   checkToken: () => ipcRenderer.invoke("auth-check"),
// });
