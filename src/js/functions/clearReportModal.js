export function clearReportModal() {
    const form = document.getElementById("reportFilterForm");
    
    // Clear all child elements inside the form
    form.innerHTML = `
      <p id="reportMessage">Select a sections to include in report:</p>
      <br><br>
      <label><input type="checkbox" name="status" value="in use"> IN USE</label>
      <label><input type="checkbox" name="status" value="missing"> MISSING</label>
      <label><input type="checkbox" name="status" value="destroyed"> DESTROYED</label>
      <br><br>
      <p> Include items audited in the last quarter?</p>
      <label><input type="radio" name="last_audit" value="Yes"> Yes</label>
      <label><input type="radio" name="last_audit" value="No"> No</label>
    `;
}