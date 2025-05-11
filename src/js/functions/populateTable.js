import { dateFormat } from "../index.js";

export function populateTable(items) {
    const tableBody = document.getElementById("table-body");
  
    tableBody.innerHTML = "";
  
    items.forEach((item) => {
      const row = document.createElement("tr");
      const formattedDate_0 = dateFormat(item.scanned_at)
      const formattedDate_1 = dateFormat(item.created_at)

      row.innerHTML = `
        <td class="middle-content"><input type="checkbox" class="select-item" data-id="${item.id}"></td>
        <td class="middle-content">${item.id}</td>
        <td class="middle-content">${item.serial_number}</td>
        <td>${item.productName}</td>
        <td>${item.subCategory}</td>
        <td>${item.category}</td>
        <td>${item.status}</td>
        <td>${item.department}</td>
        <td>${item.assignedTo}</td>
        <td class="middle-content">${formattedDate_1}</td>
        <td class="middle-content">${formattedDate_0}</td>
        <td class="action-container">
          <button class="action-button edit-item" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          Edit
          </button> 
          <button class="action-button delete-item" data-id="${item.id}">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          Delete
          </button>
        </td>
      `;
  
      tableBody.appendChild(row);
    });

    const deleteButtons = tableBody.querySelectorAll(".delete-item");
    deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const itemId = event.currentTarget.dataset.id;
        const deleteEvent = new CustomEvent("delete-item", { detail: { id: itemId } });
        document.dispatchEvent(deleteEvent);
      });
    });

    const editButtons = tableBody.querySelectorAll(".edit-item");
    editButtons.forEach(button => {
      button.addEventListener("click", async (event) => {
        const itemId = event.currentTarget.dataset.id;
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