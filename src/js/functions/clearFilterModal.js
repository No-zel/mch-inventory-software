export function clearFilterModal() {
    const form = document.getElementById("FilterForm");
    
    // Clear all child elements inside the form
    form.innerHTML = `
    <p class="report-label" id="reportMessage">Department:</p>
    <div class="polulate-modal" id="filterDepartmentContainer"></div>
    <div class="status-report-container"> 
      <p class="report-label">Status:</p>
      <label><input type="checkbox" name="status" value="Active">Active</label>
      <label><input type="checkbox" name="status" value="Condemned">Condemned</label>
      <label><input type="checkbox" name="status" value="Missing">Missing</label>
      <label><input type="checkbox" name="status" value="Pullout">Pullout</label>
    </div>
    <p class="report-label" id="reportMessage">Year Added:</p>
    <div class="year-items" id="filterYearContainer"></div>
    <button class="submit-button filter-submit" type="submit">Apply Filter</button>
  `;
}