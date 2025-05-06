export function populateDataCounter() {
    const tableBody = document.getElementById("table-body");
    const totalRows = tableBody.querySelectorAll("tr").length;
    const counter = document.getElementById("total-items");
    
    // Clear all child elements inside the form
    counter.innerHTML = `
    <p> Total items: ${totalRows} </p>
  `;
}