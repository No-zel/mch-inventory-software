export function clearReportModal() {
    const form = document.getElementById("reportFilterForm");
    
    form.innerHTML = `
    <p class="report-label" id="reportMessage">Department:</p>
    <div class="polulate-modal" id="reportDepartmentContainer"></div>
    <div class="status-report-container"> 
      <p class="report-label">Status:</p>
      <label><input type="checkbox" name="status" value="In Use">In Use</label>
      <label><input type="checkbox" name="status" value="Missing">Missing</label>
      <label><input type="checkbox" name="status" value="Destroyed">Destroyed</label>
    </div>
    <p class="report-label">Include items audited in the last quarter?</p>
    <label><input type="radio" name="last_audit" value="Yes">Yes</label>
    <label><input type="radio" name="last_audit" value="No">No</label>
  `;
  
}