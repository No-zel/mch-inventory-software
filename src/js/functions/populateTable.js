export function populateTable(items) {
    const tableBody = document.getElementById("table-body");
  
    tableBody.innerHTML = "";
  
    items.forEach((item) => {
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td><input type="checkbox" class="select-item" data-id="${item.id}"></td>
        <td>${item.id}</td>
        <td>${item.serialNumber}</td>
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${item.subCategory}</td>
        <td>${item.status}</td>
        <td>${item.department}</td>
        <td>${item.assignedTo}</td>
        <td>
          <button class="edit-item" data-id="${item.id}">Edit</button> 
          <button class="delete-item" data-id="${item.id}">Delete</button>
        </td>
      `;
  
      tableBody.appendChild(row);
    });

    const deleteButtons = tableBody.querySelectorAll(".delete-item");
    deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const itemId = event.target.dataset.id;
        const deleteEvent = new CustomEvent("delete-item", { detail: { id: itemId } });
        document.dispatchEvent(deleteEvent);
      });
    });

    const editButtons = tableBody.querySelectorAll(".edit-item");
    editButtons.forEach(button => {
      button.addEventListener("click", async (event) => {
        const itemId = event.target.dataset.id;
            try {
              const {data, error} = await window.api.request({
                method: "get",
                url: `/item/find/${itemId}`, 
              });
          
              if (error) {
                console.error("Request Error:", error);
                return;
              }
          
              if (data.status === 200) {
                const editEvent = new CustomEvent("edit-item", { detail: { id: data?.data } });
                document.dispatchEvent(editEvent);
              } 
            } catch (err) {
              console.error("Fetch error:", err);
            }
      });
    });
}