const { BrowserWindow, ipcMain } = require("electron");

let printWindow;

function setupPrintHandler() {
  ipcMain.on("open-print-window", (event, { qrCodes, paperSize }) => {
    if (printWindow) {
      printWindow.focus();
      return;
    }

    printWindow = new BrowserWindow({
      width: 600,
      height: 800,
      show: false, // Hide initially to prevent flickering
      webPreferences: {
        nodeIntegration: true,
      },
    });

    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(generatePrintHTML(qrCodes))}`);

    printWindow.webContents.once("did-finish-load", () => {
      printWindow.show(); // Show preview window

      setTimeout(() => {
        const printOptions = {
          silent: false,
          printBackground: true,
          pageSize: paperSize, // ✅ Set paper size dynamically
        };

        printWindow.webContents.print(printOptions, (success, failureReason) => {
          if (!success) console.error("Print failed:", failureReason);
          printWindow.close(); // Close window after printing
        });
      }, 1000);
    });

    printWindow.on("closed", () => {
      printWindow = null;
    });
  });
}

function generatePrintHTML(qrCodes) {
  let qrHTML = qrCodes.map(qr => `
    <div class="qr-item">
      <p>ID: ${qr.id}</p>
      <img src="${qr.qrImage}" />
    </div>
  `).join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .qr-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
          .qr-item { text-align: center; border: 1px solid black; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>QR Codes</h1>
        <div class="qr-container">${qrHTML}</div>
      </body>
    </html>
  `;
}

module.exports = { setupPrintHandler };
