export async function populateArchiveModal(items) {
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
            const {data, status} = await window.api.request({
                method: "get",
                url: `/item/delete/retrieve/${itemId}`,
            });
            if (status === 200) {
                archive = data.data
                populateArchiveModal(archive)
            } else {
                console.error("Unexpected response:", status);
                return;
            }
        } catch (err) {
            console.error("Fetch error:", err);
            return;
        }
        const retrieveEvent = new CustomEvent("retrieve-item", { detail: { id: itemID } });
        document.dispatchEvent(retrieveEvent);
      });
    });
}