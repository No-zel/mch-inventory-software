export async function generateAndPrintQR() { 
    const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
    let itemsToPrint = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);
  
    if (itemsToPrint.length === 0) {
      alert("No items available to print QR codes.");
      return;
    }
  
    // let paperSize = document.getElementById("paperSize").value; 
  
    let qrCodes = await Promise.all(itemsToPrint.map(async (id) => {
      let qrImage = await window.qr.generate(id);
      return { id, qrImage };
    }));
  
    window.electron.send("open-print-window", { qrCodes });
  }