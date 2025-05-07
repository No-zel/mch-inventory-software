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
      <p><strong>ID:</strong> ${qr.id}</p>
      <p><strong>Item Name:</strong> ${qr.rowData[3]} ${qr.rowData[4]}</p>
      <p><strong>Category:</strong> ${qr.rowData[5]}</p>
      <p><strong>Department:</strong> ${qr.rowData[7]}</p>
      <p><strong>Assigned to:</strong> ${qr.rowData[8]}</p>
      <p><strong>Date Created:</strong> ${qr.rowData[9]}</p>
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

  const departmentGroups = reportItems.reduce((groups, item) => {
    const dept = item.department;
    if (!groups[dept]) groups[dept] = [];
    groups[dept].push(item);
    return groups;
  }, {});

    const tables = Object.entries(departmentGroups).map(([dept, items]) => {
      const rows = items.map(item => {
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
            <td>${item.serial_number}</td>
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

      const itemsTotalDepartment = items.length;

      const categoryGroups = items.reduce((acc, item) => {
        const category = item.category
        if(!acc[category]) acc[category] = []
        acc[category].push(item)
        return acc
      }, {});

        const categoryItems = Object.entries(categoryGroups).map(([cat, items]) => {

          const itemTotalCategory = items.length

          const productCounts = items.reduce((acc, item) => {
            const name = `${item.productName} ${item.subCategory}`;
            acc[name] = (acc[name] || 0) + 1;
            return acc;
          }, {});
    
          const overviewLines = Object.entries(productCounts)
          .map(([name, count]) => `<div>- ${name} (${count})</div>`)
          .join("");
          

          return `
            <div class="counter-container">   
              <strong>${cat} (${itemTotalCategory})</strong> ${overviewLines}
            </div>
          `;
        })

      return `
        <h2>Department: ${dept} (${itemsTotalDepartment})</h2>
        ${categoryItems.join("")}
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Serial</th><th>Product</th><th>Category</th><th>Sub</th><th>Status</th><th>Dept</th><th>Assigned</th><th>Last Audited</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <br/>
      `;
    }).join("");

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial; margin: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
          h1 { text-align: center; }
          .counter-container { color: rgb(59 59 59); margin-bottom: 10px;}
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
        ${tables}
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

// function generateReportHTML(reportItems) {
//   let rows = reportItems.map(item => {
//     const date = new Date(item.scanned_at);
//     const formattedDate = date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//     });
  
//     return `
//       <tr>
//         <td>${item.id}</td>
//         <td>${item.serial_number}</td>
//         <td>${item.productName}</td>
//         <td>${item.category}</td>
//         <td>${item.subCategory}</td>
//         <td>${item.status}</td>
//         <td>${item.department}</td>
//         <td>${item.assignedTo}</td>
//         <td>${formattedDate}</td>
//       </tr>
//     `;
//   }).join("");

//   return `
//     <html>
//       <head>
//         <style>
//           body { font-family: Arial; margin: 20px; }
//           table { width: 100%; border-collapse: collapse; }
//           th, td { border: 1px solid #000; padding: 8px; text-align: left; }
//           th { background-color: #f0f0f0; }
//           @media print { .no-print { display: none; } }
//         </style>
//       </head>
//       <body>
//         <div class="no-print">
//           <label for="paperSelect">Paper Size:</label>
//           <select id="paperSelect">
//             <option value="A4">A4</option>
//             <option value="Letter">Letter</option>
//             <option value="Legal">Legal</option>
//           </select>
//           <button onclick="triggerPrint()">Print</button>
//         </div>
//         <h1>Audit Report</h1>
//         <table>
//           <thead>
//             <tr>
//               <th>ID</th><th>Serial</th><th>Product</th><th>Category</th><th>Sub</th><th>Status</th><th>Dept</th><th>Assigned</th><th>Last Audited</th>
//             </tr>
//           </thead>
//           <tbody>${rows}</tbody>
//         </table>

//         <script>
//           const { ipcRenderer } = require("electron");
//           function triggerPrint() {
//             const selectedPaperSize = document.getElementById("paperSelect").value;
//             ipcRenderer.send("print-now", selectedPaperSize);
//           }
//         </script>
//       </body>
//     </html>
//   `;
// }

module.exports = { setupPrintHandler };