export function clearFilterModal() {
    const form = document.getElementById("FilterForm");
    
    // Clear all child elements inside the form
    form.innerHTML = `
    <p class="report-label" id="reportMessage">Department:</p>
    <div class="polulate-modal" id="filterDepartmentContainer"></div>
    <button class="submit-button filter-submit" type="submit">Apply Filter</button>
  `;
}