import { showNotification, getArchives } from '../index.js'

export async function populateArchiveModal(items) {
    const user = JSON.parse(localStorage.getItem("user"));
    const tableBody = document.getElementById("manage-archived-items-table-body");
    tableBody.innerHTML = "";

    items.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td> ${item.id} </td>
        <td> ${item.productName} ${item.subCategory}</td>
        <td> ${item.department} </td>
        <td class="manage-button-container"> 
            <button class="retrive-btn manage-action-button" data-id="${item.id}"> Retrieve </button>
        </td>
        `;
        tableBody.appendChild(tr);
    });

    const retrivebutton = tableBody.querySelectorAll(".retrive-btn");
    retrivebutton.forEach(button => {
      button.addEventListener("click", async (event) => {
        const itemID = event.currentTarget.dataset.id;

        try {
            const {status, error} = await window.api.request({
                method: "patch",
                url: `/item/delete/retrieve`,
                bodyObj: {
                    id: itemID,
                    username: user.username,
                }
            });
            if (status === 200) {
                showNotification("Item Retrieve");
                getArchives();
            } else {
                showNotification(error);
                return;
            }
        } catch (err) {
            console.error("Fetch error:", err);
            return;
        }
        // const retrieveEvent = new CustomEvent("retrieve-item", { detail: { id: itemID } });
        // document.dispatchEvent(retrieveEvent);
      });
    });
}