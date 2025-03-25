const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const auth = require("./src/auth/auth"); 

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/auth/preload.js"), 
    },
  });

  win.loadFile("src/views/index.html");
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

ipcMain.handle("auth-check", (event) => {
  return auth.getToken();
});
