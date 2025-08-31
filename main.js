const { app, BrowserWindow, ipcMain, session, dialog  } = require("electron");
const QRCode = require("qrcode");
const path = require("path");
// const auth = require("./src/auth/auth");
const { APIRequest } = require("./src/utils/request");
const { setupPrintHandler } = require("./src/utils/print");
const apiRequest = new APIRequest();
let authToken = null;
const XLSX = require("xlsx");
const fs = require("fs");

const createWindow = () => {
  const splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    icon: path.join(__dirname, "src/assets", "mch_logo.ico"),
  });
  splash.loadFile("src/views/splash.html");

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    icon: path.join(__dirname, "src/assets", "mch_logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "src/auth/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });
  //  win.setMenu(null);
  win.loadFile("src/views/login.html");

  win.once("ready-to-show", () => {
    splash.destroy();
    win.maximize();
    win.show(); 
  });
};


app.whenReady().then(() => {
  createWindow();
  setupPrintHandler();

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

ipcMain.handle("APIRequest", async (_, { method, url, bodyObj }) => {
  try {
    if (!["get", "post", "patch", "delete"].includes(method)) {
      throw new Error("Invalid HTTP method");
    }
    return await apiRequest[method]({ url, bodyObj, token: authToken });
  } catch (error) {
    return { error: error.message };
  }
});

ipcMain.handle("generateQRCode", async (_, data) => {
  try {
    return await QRCode.toDataURL(data);
  } catch (error) {
    console.error("QR Code generation error:", error);
    return null;
  }
});

ipcMain.handle("set-auth-token", (_, token) => {
  authToken = token;
});

ipcMain.handle("export-to-excel", async (_, data) => {
  try {
    const defaultPath = path.join(app.getPath("documents"), "allItems.xlsx");

    const { filePath, canceled } = await dialog.showSaveDialog({
      title: "Save Excel File",
      defaultPath,
      filters: [{ name: "Excel Files", extensions: ["xlsx"] }],
    });

    if (canceled || !filePath) return { canceled: true };

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, filePath);

    return { success: true, filePath };
  } catch (error) {
    console.error("Excel export failed:", error);
    return { error: error.message };
  }
});