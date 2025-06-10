export async function populateManageUsers(users) {
    const tableBody = document.getElementById("manage-users-table-body");
    tableBody.innerHTML = "";

    users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td> ${user.username} </td>
        <td class="manage-button-container"> 
            <button class="edit-btn manage-action-button" data-id="${user.id}"> Edit </button>
            <button class="delete-btn manage-action-button" data-id="${user.id}"> Delete </button> 
        </td>
        `;
        tableBody.appendChild(tr);
    });
}