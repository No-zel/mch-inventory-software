import { showNotification } from '../index.js';

export async function generateAndPrintQR() { 
    // const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
    // const selectedRows = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.closest("tr"));
    // let itemsToPrint = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);
    const loadingIndicator = document.getElementById("loading");
    const checkboxes = [...document.querySelectorAll(".select-item")];
    const selected = checkboxes
    .filter(checkbox => checkbox.checked)
    .map(checkbox => ({
      id: checkbox.dataset.id,
      row: checkbox.closest("tr")
    }));

    const itemsToProcess = selected.length > 0
    ? selected
    : checkboxes.map(checkbox => ({
        id: checkbox.dataset.id,
        row: checkbox.closest("tr")
      }));

      if (itemsToProcess.length === 0) {
        showNotification("No items available to print QR codes.");
        return;
      }

    // if (itemsToPrint.length === 0) {
    //   showNotification("No items available to print QR codes.");
    //   return;
    // }
    loadingIndicator.style.display = "flex";
    try {
      let qrCodes = await Promise.all(
        itemsToProcess.map(async ({ id, row }) => {
          const qrImage = await window.qr.generate(id);
          const rowData = [...row.cells].map(cell => cell.textContent.trim());
      
          return { id, qrImage, rowData };
        })
      );

      window.electron.send("open-print-window", { qrCodes });
    } catch {
      console.log(error)
    } finally {
      loadingIndicator.style.display = "none";
    }

    // let qrCodes = await Promise.all(itemsToPrint.map(async (id) => {
    //   let qrImage = await window.qr.generate(id);
    //   return { id, qrImage };
    // }));
  
  }