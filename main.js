const { app, BrowserWindow, ipcMain, session } = require("electron");
const QRCode = require("qrcode");
const path = require("path");
const auth = require("./src/auth/auth");
const { APIRequest } = require("./src/utils/request");
const { setupPrintHandler } = require("./src/utils/print");

const apiRequest = new APIRequest();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "src/auth/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: true,
    },
  });

  win.loadFile("src/views/table.html");
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
    return await apiRequest[method]({ url, bodyObj });
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

// ipcMain.handle("auth-check", (event) => {
//   return auth.getToken();
// });
