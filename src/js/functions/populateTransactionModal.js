export async function populateTransaction() {
    const TransactionTableBody = document.getElementById("transaction-table-body");
    TransactionTableBody.innerHTML = "";

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const {data, error} = await window.api.request({
                method: "get",
                url: `/account/transaction/${user.username}`, 
            });
          
            if (error) {
                console.error("Request Error:", error);
                return;
            }
          
            if (data) {
                data.data.forEach((item) => {
                const row = document.createElement("tr");
                const date = new Date(item.created_at);
                const formattedDate = date.toLocaleString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });

                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.username}</td>
                    <td>${item.actions}</td>
                    <td>${formattedDate}</td>
                `;
                TransactionTableBody.appendChild(row);
                });
            } 
            } catch (err) {
              console.error("Fetch error:", err);
            }
}