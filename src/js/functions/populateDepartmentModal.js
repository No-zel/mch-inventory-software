export function populateDepartmentModal(containerId = "departmentContainer") {
  const data = window.allItems;
  const departments = [...new Set(data.map(item => item.department))];

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with ID '${containerId}' not found.`);
    return;
  }

  container.innerHTML = "";

  departments.forEach(department => {
    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "department";
    checkbox.value = department;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + department));
    container.appendChild(label);
  });
}

// export function populateDepartmentModal() {
//   const data = window.allItems;
//   const departments = [...new Set(data.map(item => item.department))];

//   const container = document.getElementById("departmentContainer");
//   container.innerHTML = ""; 

//   departments.forEach(department => {
//     const label = document.createElement("label");
//     label.style.display = "block";

//     const checkbox = document.createElement("input");
//     checkbox.type = "checkbox";
//     checkbox.name = "department";
//     checkbox.value = department;

//     label.appendChild(checkbox);
//     label.appendChild(document.createTextNode(" " + department));

//     container.appendChild(label);
//   });
// }