import { showNotification } from '../index.js';

export async function exportData() {

  try {
    const items = window.allItems.map(item => ({
      ...item,
      created_at: item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      }) : null,
      updated_at: item.updated_at ? new Date(item.updated_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      }) : null,
      scanned_at: item.scanned_at ? new Date(item.scanned_at).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
      }) : null
    }));

    const reordered = items.map(item => ({
      "ID": item.id,
      "Serial Number": item.serial_number,
      "Category": item.category,
      "Sub-Category": item.subCategory,
      "Name": item.productName,
      "Status": item.status,
      "Department": item.department,
      "Custodian": item.assignedTo,
      "Created": item.created_at,
      "Scanned": item.scanned_at,
      "Updated": item.updated_at,
    }));

    const result = await window.excelExporter.exportData(reordered);
    
    if (result.success) {
      showNotification(`Exported to: ${result.filePath}`)
    } else if (result.canceled) {
      console.log("User canceled the export.");
    } else {
      console.error("Export failed:", result.error);
    }
  } catch (error) {
    console.error("Export failed with error:", error);
  }
}
