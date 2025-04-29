export function populateReportModal() {
    const data = window.allItems;
    const departments = data.map(item => item.department);
    const uniqueDepartments = [...new Set(departments)];

    const reportForm = document.getElementById("reportFilterForm");

    reportForm.querySelectorAll('[name="department"]').forEach(checkbox => checkbox.remove());

    uniqueDepartments.forEach(department => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "department";
      checkbox.value = department;
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(department.toUpperCase()));
      reportForm.insertBefore(label, reportForm.querySelector("br"));
    });
}