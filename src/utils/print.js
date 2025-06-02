const { BrowserWindow, ipcMain } = require("electron");
const fs = require('fs');
const path = require('path');

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
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, "../auth/preload.js"), // ✅ use preload
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
        contextIsolation: true,
        nodeIntegration: false,
        preload: path.join(__dirname, "../auth/preload.js"), 
      },
    });

    const html = generateReportHTML(reportItems);
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

    printWindow.once("ready-to-show", () => printWindow.show());

    printWindow.on("closed", () => (printWindow = null));
  });

  ipcMain.on("print-now", (event, selectedPaperSize) => {
    if (printWindow) {
      printWindow.webContents.send('show-loading'); 
      printWindow.webContents.print(
        {
          silent: false,
          printBackground: true,
          pageSize: selectedPaperSize,
        },
        (success, error) => {
          if (!success) console.error("Print failed:", error);
          printWindow.webContents.send('hide-loading'); 
          printWindow.close();
        }
      );
    }
  });
}

function generatePrintHTML(qrCodes) {
  let qrHTML = qrCodes.map(qr => `
    <div class="qr-item">
      <div class="info-container">
        <p class="warning-paragraph">MCH property do not destory</p>
        <p><strong>ID:</strong> MCH - ${qr.id}</p>
        <p><strong>Item Name:</strong> ${qr.rowData[3]} ${qr.rowData[4]}</p>
        <p><strong>Category:</strong> ${qr.rowData[5]}</p>
        <p><strong>Department:</strong> ${qr.rowData[7]}</p>
        <p><strong>Custodian:</strong> ${qr.rowData[8]}</p>
        <p><strong>Date Created:</strong> ${qr.rowData[9]}</p>
      </div>
      <div "qr-image-container"> 
        <img src="${qr.qrImage}" />
      </div>

    </div>
  `).join("");

  return `
    <html>
      <head>
        <style>
          h1 {
            text-align: center;
          }
          p {
            margin: 3px;
          }
          body {
            font-family: Arial, sans-serif;
          }

          .qr-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1px;
          }
          #controls {
            text-align: center; 
            margin-top: 20px;
          }  
          .section-container,
          .print-button {
            display: inline-block; /* allow horizontal centering */
            margin: 0 10px;
          }

          .qr-item {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            border: 1px solid black;
            padding: 4px;
            font-size: 10px;
            font-weight: bold;
            text-align: left;
          }
          .print-button{
            width: 180px;
            height: 50px;
            background-color: #f0f0f0; 
            color: rgb(44, 44, 44);
            border: 1px solid #000000; 
            border-radius: 5px; 
            padding: 1px;
            font-family: 'Tahoma', sans-serif; 
            font-weight: bold;
            font-size: 12px; 
            cursor: pointer; 
            transition: background-color 0.3s, color 0.3s; 
          }
          .print-button:hover,
          .print-button:focus {
            background-color: rgb(44, 44, 44); 
            color: white; 
            border: 1px solid rgb(44, 44, 44);
            text-decoration: none; 
          }
          @media print {
            .no-print {
              display: none;
            }
          }
          #paperSelect {
            width: 100px
          }
          .warning-paragraph {
          color: rgb(255, 108, 108);
          }
          .section-container{
            display: flex;
            margin-bottom: 10px;
            justify-content: center;
            align-items: center;
          }
          #loading.spinner-overlay {
            display: none; /* hidden by default */
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-size: 1rem;
          }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #363636;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            animation: spin 0.8s linear infinite;
            margin-bottom: 10px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="no-print" id="controls">
          <div id="loading" class="spinner-overlay" style="display: none;">
            <div class="spinner"></div>
            <p>Printing... Do not close</p>
          </div>
          <div class="section-container">
            <label for="paperSelect">Paper Size: </label>
            <select id="paperSelect">
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <button class="print-button" onclick="triggerPrint()">Print</button>
          <h1>QR Codes</h1>
        </div>
        <div class="qr-container">${qrHTML}</div>

        <script>
          window.loading.receive("show-loading", () => {
            document.getElementById("loading").style.display = "flex"; 
          });

          window.loading.receive("hide-loading", () => {
            document.getElementById("loading").style.display = "none"; 
          });

          function triggerPrint() {
            const selectedPaperSize = document.getElementById("paperSelect").value;
            window.printer.printNow(selectedPaperSize);
          }
          console.log("✅ Print window loaded and ready.");
        </script>
      </body>
    </html>
  `;
}
function generateReportHTML(reportItems) {
  const imagePath = path.join(__dirname, '../assets/mch-logo.jpeg');
  const imagePath2 = path.join(__dirname, '../assets/mexico-logo.jpeg');

  const imageBuffer = fs.readFileSync(imagePath);
  const imageBuffer2 = fs.readFileSync(imagePath2);

  const base64Image = imageBuffer.toString('base64');
  const base64Image2 = imageBuffer2.toString('base64');

  const dataURI = `data:image/jpeg;base64,${base64Image}`;
  const dataURI2 = `data:image/png;base64,${base64Image2}`;

  if (!fs.existsSync(imagePath) || !fs.existsSync(imagePath2)) {
  throw new Error("Image not found");
}

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
        <h3>Department: ${dept} (${itemsTotalDepartment})</h3>
        ${categoryItems.join("")}
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Serial</th><th>Product</th><th>Category</th><th>Sub</th><th>Status</th><th>Dept</th><th>Custodian</th><th>Last Audited</th>
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
          body { 
            font-family: Arial; 
            margin: 20px; 
          }
          table { 
            width: 100%; 
            border-collapse: 
            collapse; 
            margin-bottom: 30px; 
          }
          th, td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: left; 
          }
          th { 
            background-color: #f0f0f0; 
          }
          h2 { 
            text-align: center; 
          }
          .counter-container { 
            color: rgb(59 59 59); 
            margin-bottom: 10px;
          }
          .logo { 
            position: absolute; 
            height: 60px; 
          }
          @media print { 
            .no-print { 
              display: none; 
            } 
          }
          .print-button{
            width: 180px;
            height: 50px;
            background-color: #f0f0f0; 
            color: rgb(44, 44, 44);
            border: 1px solid #000000; 
            border-radius: 5px; 
            padding: 1px;
            font-family: 'Tahoma', sans-serif; 
            font-weight: bold;
            font-size: 12px; 
            cursor: pointer; 
            transition: background-color 0.3s, color 0.3s; 
          }
          .print-button:hover,
          .print-button:focus {
            background-color: rgb(44, 44, 44); 
            color: white; 
            border: 1px solid rgb(44, 44, 44);
            text-decoration: none; 
          }
          #paperSelect {
            width: 100px
          }
          #controls {
            text-align: center; 
            margin-top: 20px;
          }
          .section-container{
            display: flex;
            margin-bottom: 10px;
            justify-content: center;
            align-items: center;
          }
          #loading.spinner-overlay {
            display: none; /* hidden by default */
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-size: 1rem;
          }

          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #363636;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            animation: spin 0.8s linear infinite;
            margin-bottom: 10px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="no-print" id="controls">
          <div id="loading" class="spinner-overlay" style="display: none;">
            <div class="spinner"></div>
            <p>Printing... Do not close</p>
          </div>
          <div class="section-container"> 
            <label for="paperSelect">Paper Size:</label>
            <select id="paperSelect">
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <button class="print-button" onclick="triggerPrint()">Print</button>
        </div>

        <h2>Quarterly Asset Report - Mexico Community Hospital</h2>
        ${tables}
        <script>
          window.loading.receive("show-loading", () => {
            document.getElementById("loading").style.display = "flex"; 
          });

          window.loading.receive("hide-loading", () => {
            document.getElementById("loading").style.display = "none"; 
          });
          function triggerPrint() {
            const selectedPaperSize = document.getElementById("paperSelect").value;
            window.printer.printNow(selectedPaperSize);
          }
          console.log("✅ Print window loaded and ready.");
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
// function setupPrintHandler() {
//   ipcMain.on("open-print-window", (event, { qrCodes }) => {
//     if (printWindow) {
//       printWindow.focus();
//       return;
//     }

//     printWindow = new BrowserWindow({
//       width: 800,
//       height: 900,
//       show: false,
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false,
//       },
//     });

//     const html = generatePrintHTML(qrCodes);
//     printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

//     printWindow.once("ready-to-show", () => {
//       printWindow.show();
//     });

//     printWindow.on("closed", () => {
//       printWindow = null;
//     });
//   });

//   ipcMain.on("open-report-print-window", (event, { reportItems }) => {
//     if (printWindow) {
//       printWindow.focus();
//       return;
//     }
  
//     printWindow = new BrowserWindow({
//       width: 900,
//       height: 1000,
//       show: false,
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false,
//       },
//     });
  
//     const html = generateReportHTML(reportItems); 
//     printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
  
//     printWindow.once("ready-to-show", () => printWindow.show());
  
//     printWindow.on("closed", () => printWindow = null);
//   });

//   ipcMain.on("print-now", (event, selectedPaperSize) => {
//     if (printWindow) {
//       printWindow.webContents.print({
//         silent: false,
//         printBackground: true,
//         pageSize: selectedPaperSize,
//       }, (success, error) => {
//         if (!success) console.error("Print failed:", error);
//         printWindow.close();
//       });
//     }
//   });
// }

module.exports = { setupPrintHandler };