document.addEventListener("DOMContentLoaded", async () => {
  if (!window.api || !window.api.request) {
    console.error("Error: window.api.request is undefined. Check preload.js.");
    return;
  }

  async function getProducts() {
    try {
      const {response, data, error} = await window.api.request({
        method: "get",
        url: "/item/find/",
      });

      if (error) {
        console.error("API Error:", error);
        return;
      }

      if (data.message === "Success") {
        populateTable(data.data);
      } else {
        console.error("Unexpected response:", response?.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function populateTable(items) {
    const tableBody = document.getElementById("table-body");

    tableBody.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><input type="checkbox" class="select-item" data-id="${item.id}"></td>
        <td>${item.id}</td>
        <td>${item.productname}</td>
        <td>${item.department}</td>
        <td>${item.category}</td>
        <td>${item.status}</td>
        <td>${item.assigned_to}</td>
      `;

      tableBody.appendChild(row);
    });
  }
  getProducts();
});

const registerModal = document.getElementById("registerModal");
const notificationModal = document.getElementById("notificationModal");

const openRegisterModal = document.getElementById("openRegisterModal");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const closeNotification = document.getElementById("closeNotification");

openRegisterModal.onclick = () => registerModal.style.display = "block";

closeRegisterModal.onclick = () => registerModal.style.display = "none";
closeNotification.onclick = () => notificationModal.style.display = "none";

window.onclick = (event) => {
  if (event.target === registerModal) registerModal.style.display = "none";
  if (event.target === notificationModal) notificationModal.style.display = "none";
};

function showNotification(message) {
  document.getElementById("notificationMessage").textContent = message;
  notificationModal.style.display = "block";
}

async function createItem(event) {

  event.preventDefault();
  
  let productNameValue = document.getElementById("productName").value;
  let DepartmentValue = document.getElementById("department").value;
  let CategoryValue = document.getElementById("category").value;
  let QuantityValue = parseInt(document.getElementById("quantity").value, 10);
  let assignedToValue = document.getElementById("assigned_to").value;

  try {

    let requestBody =  {
      productname: productNameValue,
      department: DepartmentValue,
      category: CategoryValue,
      quantity: QuantityValue,
      assigned_to: assignedToValue
    };

    console.log("req body:", requestBody)

    const {response, error} = await window.api.request({
      method: "post",
      url: "/item/create/", 
      bodyObj: requestBody
    });

    console.log(response)

    if (error) {
      console.error("API Error:", error);
      return;
    }
    if (response) {
      showNotification("Item added successfully!");
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function generateAndPrintQR() {
  const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
  let itemsToPrint = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);

  if (itemsToPrint.length === 0) {
    alert("No items available to print QR codes.");
    return;
  }

  // Open a blank print window
  let printWindow = window.open("", "_blank");
  let doc = printWindow.document;

  // Create and append the <html> structure dynamically
  let html = doc.createElement("html");
  let head = doc.createElement("head");
  let body = doc.createElement("body");

  // Set up head with styles
  let style = doc.createElement("style");
  style.textContent = `
    body { font-family: Arial, sans-serif; text-align: center; }
    .qr-container { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
    .qr-item { text-align: center; border: 1px solid black; padding: 10px; }
  `;
  head.appendChild(style);

  // Add heading
  let title = doc.createElement("h1");
  title.textContent = "QR Codes";
  body.appendChild(title);

  // QR container
  let qrContainer = doc.createElement("div");
  qrContainer.classList.add("qr-container");

  // Append everything
  doc.head.appendChild(head);
  doc.body.appendChild(title);
  doc.body.appendChild(qrContainer);
  html.appendChild(head);
  html.appendChild(body);
  doc.appendChild(html);

  // Wait for the new window to fully load
  setTimeout(async () => {
    for (let id of itemsToPrint) {
      let qrImage = await window.qr.generate(id); // Calls the exposed QR function
      let div = document.createElement("div");
      div.classList.add("qr-item");
      div.innerHTML = `<p>ID: ${id}</p><img src="${qrImage}">`;
      qrContainer.appendChild(div);
    }

    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }, 500);
}