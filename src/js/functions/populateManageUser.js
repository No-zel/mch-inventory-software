export async function populateManageUsers(users) {
    const tableBody = document.getElementById("manage-users-table-body");
    tableBody.innerHTML = "";

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td> ${user.username} </td>
        <td class="manage-button-container"> 
            <button class="edit-user-btn manage-action-button" data-id="${user.id}"> Edit </button>
            <button class="delete-user-btn manage-action-button" data-id="${user.id}"> Delete </button> 
        </td>
        `;
        tableBody.appendChild(tr);
    });

    const deleteButtons = tableBody.querySelectorAll(".delete-user-btn");
    deleteButtons.forEach(button => {
      button.addEventListener("click", (event) => {
        const accountID = event.currentTarget.dataset.id;
        const deleteEvent = new CustomEvent("delete-account", { detail: { id: accountID } });
        document.dispatchEvent(deleteEvent);
      });
    });

    const editButtons = tableBody.querySelectorAll(".edit-user-btn");
    editButtons.forEach(button => {
      button.addEventListener("click", async (event) => {
        const accountID = event.currentTarget.dataset.id;
            try {
              const {data, error} = await window.api.request({
                method: "get",
                url: `/account/update/${accountID}`, 
              });
          
              if (error) {
                console.error("Request Error:", error);
                return;
              }
          
              if (data.data) {
                const editEvent = new CustomEvent("edit-account", { detail: { id: data?.data } });
                document.dispatchEvent(editEvent);
              } 
            } catch (err) {
              console.error("Fetch error:", err);
            }
      });
    });
}