import { showNotification } from '../index.js';

export async function generateAndPrintReport() {
  const checkedInputs = Array.from(document.querySelectorAll('#reportFilterForm input:checked'));

  const filters = {
    department: [],
    status: [],
    last_audit: null,
  };

  checkedInputs.forEach(input => {
    if (input.name === "last_audit") {
      filters.last_audit = input.value;
    } else if (filters.hasOwnProperty(input.name)) {
      filters[input.name].push(input.value);
    }
  });

  try {
    const { response, data, error } = await window.api.request({
      method: "get",
      url: "/item/find/",
    });

    if (data.data.length === 0 || error) {
      reportSelectionModal.style.display = "none";
      showNotification("No items available to print QR codes.");
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentQuarter = Math.floor(currentMonth / 3);
    const startOfPrevQuarter = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);

    const reportItems = data.data.filter(item => {
      const matchDepartment = filters.department.length ? filters.department.includes(item.department) : true;
      const matchStatus = filters.status.length ? filters.status.includes(item.status) : true;

      let matchLastAudit = true;
      if (filters.last_audit === "Yes") {
        matchLastAudit = item.scanned_at && new Date(item.scanned_at) >= startOfPrevQuarter;
      } else if (filters.last_audit === "No") {
        matchLastAudit = !item.scanned_at || new Date(item.scanned_at) < startOfPrevQuarter;
      }

      return matchDepartment && matchStatus && matchLastAudit;
    });

    window.electron.send("open-report-print-window", { reportItems });

    const checkboxes = document.querySelectorAll('#reportFilterForm input[type="checkbox"]');
    checkboxes.forEach(checkbox => checkbox.checked = false);
  
    const radioButtons = document.querySelectorAll('#reportFilterForm input[type="radio"]');
    radioButtons.forEach(radio => radio.checked = false);
    
    reportSelectionModal.style.display = "none";
  } catch (err) {
    console.error(err);
  }
}


// export async function generateAndPrintReport() { 

//   const checkedInputs = Array.from(document.querySelectorAll('#reportFilterForm input:checked'));

//   const filters = {
//     department: [],
//     status: [],
//     last_audit: []
//   };

//   checkedInputs.forEach(input => {
//     if (filters.hasOwnProperty(input.name)) {
//       filters[input.name].push(input.value);
//     }
//   });

//     try {
//         const { response, data, error } = await window.api.request({
//           method: "get",
//           url: "/item/find/",
//         });

//         if (data.data.length === 0 || error) {
//           reportSelectionModal.style.display = "none";
//           alert("No items available to print QR codes.");
//           return;
//         }

//         const reportItems = data.data.filter(item => {
//           const matchDepartment = filters.department.length ? filters.department.includes(item.department) : true;
//           const matchStatus = filters.status.length ? filters.status.includes(item.status) : true;
//           return matchDepartment && matchStatus;
//         });

//         window.electron.send("open-report-print-window", { reportItems });
  
//         reportSelectionModal.style.display = "none";
        
//     } catch (err) {
//         console.error(err)
//     }
// }