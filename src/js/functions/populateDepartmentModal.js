export function populateDepartmentModal(containerId = "departmentContainer", yearcontainerId = "yearContainer" ) {
  const data = window.allItems;

  const departments = [...new Set(data.map(item => item.department))];
  const years = [...new Set(
    data.map(item => {
      const date = new Date(item.created_at);
      return date.getFullYear().toString();
    })
  )];

  const container = document.getElementById(containerId);
  const yearcontainer = document.getElementById(yearcontainerId);

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

  years.forEach(year => {

    const label = document.createElement("label");
    label.style.display = "block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "year";
    checkbox.value = year;

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + year));
    yearcontainer.appendChild(label);
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