const { contextBridge, ipcRenderer } = require("electron");
  
console.log("✅ Preload script loaded successfully!");

contextBridge.exposeInMainWorld("api", {
  request: async ({ method, url, bodyObj = {} }) => {
    try {
      return await ipcRenderer.invoke("APIRequest", { method, url, bodyObj });
    } catch (error) {
      console.error("API request error:", error);
      return { error: "API request failed" };
    }
  },
});

contextBridge.exposeInMainWorld("qr", {
  generate: async (data) => {
    try {
      return await ipcRenderer.invoke("generateQRCode", data);
    } catch (error) {
      console.error("Generate error:", error)
      return
    }
   
  },
});

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data), 
});

contextBridge.exposeInMainWorld("auth", {
  setToken: async (token) => {
    await ipcRenderer.invoke("set-auth-token", token);
  }
});

contextBridge.exposeInMainWorld("excelExporter", {
  exportData: async (data) => {
    return await ipcRenderer.invoke("export-to-excel", data);
  }
});

contextBridge.exposeInMainWorld("printer", {
  printNow: (paperSize) => ipcRenderer.send("print-now", paperSize),
});
