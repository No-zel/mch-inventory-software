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

  ipcMain.on("open-report-print-window", (event, { reportItems }) => {
    if (printWindow) {
      printWindow.focus();
      return;
    }
  
    printWindow = new BrowserWindow({
      width: 900,
      height: 1000,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
  
    const html = generateReportHTML(reportItems); 
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  
    printWindow.once("ready-to-show", () => printWindow.show());
  
    printWindow.on("closed", () => printWindow = null);
  });

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
            <option value="Legal">Legal</option>
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

function generateReportHTML(reportItems) {
  let rows = reportItems.map(item => {
    const date = new Date(item.scanned_at);
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  
    return `
      <tr>
        <td>${item.id}</td>
        <td>${item.serialNumber}</td>
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${item.subCategory}</td>
        <td>${item.status}</td>
        <td>${item.department}</td>
        <td>${item.assignedTo}</td>
        <td>${formattedDate}</td>
      </tr>
    `;
  }).join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print">
          <label for="paperSelect">Paper Size:</label>
          <select id="paperSelect">
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
          <button onclick="triggerPrint()">Print</button>
        </div>
        <h1>Audit Report</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Serial</th><th>Product</th><th>Category</th><th>Sub</th><th>Status</th><th>Dept</th><th>Assigned</th><th>Last Audited</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>

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