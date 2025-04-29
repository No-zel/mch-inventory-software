export function clearFilterModal() {
    const form = document.getElementById("FilterForm");
    
    // Clear all child elements inside the form
    form.innerHTML = `
      <h3>Select Departments</h3>
      <br><br>
      <button type="submit">Apply Filter</button>
    `;
}