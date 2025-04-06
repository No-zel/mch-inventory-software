const { BrowserWindow, ipcMain } = require("electron");

let printWindow;

function setupPrintHandler() {
  ipcMain.on("open-print-window", (event, { qrCodes }) => {
    if (printWindow) {
      printWindow.focus();
      return;
    }

    printWindow = new BrowserWindow({
      width: 800,
      height: 900,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    const html = generatePrintHTML(qrCodes);
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    printWindow.once("ready-to-show", () => {
      printWindow.show();
    });

    printWindow.on("closed", () => {
      printWindow = null;
    });
  });

  // Listen for the print request from the preview window
  ipcMain.on("print-now", (event, selectedPaperSize) => {
    if (printWindow) {
      printWindow.webContents.print({
        silent: false,
        printBackground: true,
        pageSize: selectedPaperSize,
      }, (success, error) => {
        if (!success) console.error("Print failed:", error);
        printWindow.close();
      });
    }
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
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 20px;
          }

          .qr-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
          }

          .qr-item {
            border: 1px solid black;
            padding: 10px;
          }

          .no-print {
            margin-bottom: 20px;
          }

          @media print {
            .no-print {
              display: none;
            }
          }

          @page {
            margin: 1in; /* Set custom margin here */
          }
        </style>
      </head>
      <body>
        <div class="no-print" id="controls">
          <label for="paperSelect">Paper Size:</label>
          <select id="paperSelect">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="A5">A5</option>
          </select>
          <button onclick="triggerPrint()">Print</button>
        </div>

        <h1>QR Codes</h1>
        <div class="qr-container">${qrHTML}</div>

        <script>
          const { ipcRenderer } = require("electron");

          function triggerPrint() {
            const selectedPaperSize = document.getElementById("paperSelect").value;
            ipcRenderer.send("print-now", selectedPaperSize);
          }
        </script>
      </body>
    </html>
  `;
}



module.exports = { setupPrintHandler };

// const { BrowserWindow, ipcMain } = require("electron");

// let printWindow;

// function setupPrintHandler() {
//   ipcMain.on("open-print-window", (event, { qrCodes, paperSize }) => {
//     if (printWindow) {
//       printWindow.focus();
//       return;
//     }

//     printWindow = new BrowserWindow({
//       width: 600,
//       height: 800,
//       show: false,
//       webPreferences: {
//         nodeIntegration: true,
//       },
//     });

//     printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(generatePrintHTML(qrCodes))}`);

//     printWindow.webContents.once("did-finish-load", () => {
//       printWindow.show(); // Show preview window

//       setTimeout(() => {
//         const printOptions = {
//           silent: false,
//           printBackground: true,
//           pageSize: paperSize, // ✅ Set paper size dynamically
//         };

//         printWindow.webContents.print(printOptions, (success, failureReason) => {
//           if (!success) console.error("Print failed:", failureReason);
//           printWindow.close(); // Close window after printing
//         });
//       }, 1000);
//     });

//     printWindow.on("closed", () => {
//       printWindow = null;
//     });
//   });
// }

// function generatePrintHTML(qrCodes) {
//   let qrHTML = qrCodes.map(qr => `
//     <div class="qr-item">
//       <p>ID: ${qr.id}</p>
//       <img src="${qr.qrImage}" />
//     </div>
//   `).join("");

//   return `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial, sans-serif; text-align: center; }
//           .qr-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
//           .qr-item { text-align: center; border: 1px solid black; padding: 10px; }
//         </style>
//       </head>
//       <body>
//         <h1>QR Codes</h1>
//         <div class="qr-container">${qrHTML}</div>
//       </body>
//     </html>
//   `;
// }

// module.exports = { setupPrintHandler };
