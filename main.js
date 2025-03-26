const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const auth = require("./src/auth/auth"); 
const { APIRequest } = require("./src/utils/request")
const apiRequest = new APIRequest();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/auth/preload.js"), 
      contextIsolation: true, 
      nodeIntegration: false, 
    },
  });

  win.loadFile("src/views/table.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("APIRequest", async (_, { method, url, body }) => {
  try {
    if (!["get", "post", "patch", "delete"].includes(method)) {
      throw new Error("Invalid HTTP method");
    }
    return await apiRequest[method]({ url, bodyObj: body });
  } catch (error) {
    return { error: error.message };
  }
});

// ipcMain.handle("auth-check", (event) => {
//   return auth.getToken();
// });
