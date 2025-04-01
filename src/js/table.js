document.addEventListener("DOMContentLoaded", async () => {
  if (!window.api || !window.api.request) {
    console.error("Error: window.api.request is undefined. Check preload.js.");
    return;
  }

  window.qr.generate("Hello World")
  .then((url) => {
    console.log("Generated QR Code:", url);
  })
  .catch((err) => {
    console.error("QR Code Error:", err);
  });

  getProducts();

  const confirmChoice = document.getElementById("confirmChoice");
  const registerForm = document.getElementById("registerForm")
  
  if (confirmChoice) {
    confirmChoice.onclick = async () => {
        await deleteItem(); 
        confirmationModal.style.display = "none"; 
    };

    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 
        await createItem(event);
        registerModal.style.display = "none"
      });
    } else {
      console.error("Register form not found.");
    }
  
}
});

const registerModal = document.getElementById("registerModal");
const notificationModal = document.getElementById("notificationModal");
const confirmationModal = document.getElementById("confirmationModal")

const openRegisterModal = document.getElementById("openRegisterModal");
const openDeleteModal = document.getElementById("openDeleteModal");

const closeRegisterModal = document.getElementById("closeRegisterModal");
const closeNotification = document.getElementById("closeNotification");
const cancelChoice = document.getElementById("cancelChoice");

openRegisterModal.onclick = () => registerModal.style.display = "block";
openDeleteModal.onclick = () => confirmationModal.style.display = "block";

closeRegisterModal.onclick = () => registerModal.style.display = "none";
closeNotification.onclick = () => notificationModal.style.display = "none";
cancelChoice.onclick = () => confirmationModal.style.display = "none";

window.onclick = (event) => {
  if (event.target === registerModal) registerModal.style.display = "none";
  if (event.target === notificationModal) notificationModal.style.display = "none";
  if (event.target === confirmationModal) confirmationModal.style.display = "none";
};

function showNotification(message) {
  document.getElementById("notificationMessage").textContent = message;
  notificationModal.style.display = "block";
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

    if (data.status === 200) {
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

async function createItem(event) {

  let productNameValue = document.getElementById("productName").value;
  let DepartmentValue = document.getElementById("department").value;
  let CategoryValue = document.getElementById("category").value;
  let QuantityValue = parseInt(document.getElementById("quantity").value, 10);
  let assignedToValue = document.getElementById("assigned_to").value;

  let requestBody =  {
    productname: productNameValue,
    department: DepartmentValue,
    category: CategoryValue,
    quantity: QuantityValue,
    assigned_to: assignedToValue
  };

  console.log("req body:", requestBody)

  try {
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
      getProducts();
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

async function deleteItem() {

  const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
  let itemsToDelete = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);

  try {
    const {data, error} = await window.api.request({
      method: "delete",
      url: "/item/delete/", 
      bodyObj: itemsToDelete
    });

    if (error) {
      console.error("Request Error:", error);
      showNotification("Failed to delete item!", "error");
      return;
  }

  if (data.status === 200) {
        showNotification("Item Deleted Successfully!");
        getProducts();
    } else {
        console.error("Unexpected response:", error);
        showNotification(`Failed to delete item!`, "error");
    }

  } catch (err) {
    console.error("Fetch error:", err);
  }
  console.log(itemsToDelete)
}

async function generateAndPrintQR() { 
  const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
  let itemsToPrint = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);

  if (itemsToPrint.length === 0) {
    alert("No items available to print QR codes.");
    return;
  }

  let paperSize = document.getElementById("paperSize").value; 

  let qrCodes = await Promise.all(itemsToPrint.map(async (id) => {
    let qrImage = await window.qr.generate(id);
    return { id, qrImage };
  }));

  window.electron.send("open-print-window", { qrCodes, paperSize });
}

const printQRButton = document.getElementById("printQR");

if (printQRButton) {
  printQRButton.addEventListener("click", generateAndPrintQR);
} else {
  console.error("Print QR button not found!");
}