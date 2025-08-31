export function clearReportModal() {
    const form = document.getElementById("reportFilterForm");
    
    form.innerHTML = `
    <p class="report-label" id="reportMessage">Department:</p>
    <div class="polulate-modal" id="reportDepartmentContainer"></div>
    <div class="status-report-container"> 
      <p class="report-label">Status:</p>
      <label><input type="checkbox" name="status" value="Active">Active</label>
      <label><input type="checkbox" name="status" value="Condemned">Condemned</label>
      <label><input type="checkbox" name="status" value="Missing">Missing</label>
      <label><input type="checkbox" name="status" value="Pullout">Pullout</label>
    </div>

    <div class="audit-report-container"> 
      <p class="report-label">Include items audited in the last quarter?</p>
      <label><input type="radio" name="last_audit" value="Yes">Yes</label>
      <label><input type="radio" name="last_audit" value="No">No</label>
    </div>

    <p class="report-label" id="reportMessage">Year:</p>
    <div class="year-items" id="reportYearContainer"></div>
  `;
}