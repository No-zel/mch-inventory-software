import { createItem, deleteItem, editItem, generateAndPrintQR, generateAndPrintReport, getProducts, populateTable, showNotification } from '../js/functions/index.js';

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
        await deleteItem([window.itemToDelete]); 
        window.itemToDelete = null;
        confirmationModal.style.display = "none"; 
    };

    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        if (window.itemToEdit) {
          await editItem(event, window.itemToEdit);
          window.itemToEdit = null;
        } else {
          await createItem(event);
        }
        
        registerModal.style.display = "none"
      });
    } else {
      console.error("Register form not found.");
    }
}
});

document.addEventListener("delete-item", (e) => {
  const itemIdToDelete = e.detail.id;
  window.itemToDelete = itemIdToDelete;
  confirmationModal.style.display = "block";
});

document.addEventListener("edit-item", (e) => {
  const itemIdToEdit = e.detail.id?.[0];
  window.itemToEdit = itemIdToEdit.id;
  console.log(itemIdToEdit)
  if (itemIdToEdit) {
    document.getElementById("productName").value = itemIdToEdit.productName;
    document.getElementById("department").value = itemIdToEdit.department;
    document.getElementById("serialNumber").value = itemIdToEdit.serialNumber;
    document.getElementById("category").value = itemIdToEdit.category;
    document.getElementById("subcategory").value = itemIdToEdit.subCategory;
    document.getElementById("status").value = itemIdToEdit.status || "available";
    document.getElementById("assigned_to").value = itemIdToEdit.assignedTo;

    document.getElementById("statusContainer").style.display = "block";
    document.getElementById("quantityContainer").style.display = "none";
  }
  registerModal.style.display = "block";
});

const registerModal = document.getElementById("registerModal");
const notificationModal = document.getElementById("notificationModal");
const confirmationModal = document.getElementById("confirmationModal");
const reportSelectionModal = document.getElementById("reportSelectionModal")

const openRegisterModal = document.getElementById("openRegisterModal");
const openReportModal = document.getElementById("openReportModal");

const closeRegisterModal = document.getElementById("closeRegisterModal");
const closeNotification = document.getElementById("closeNotification");
const closeReportModal = document.getElementById("closeReportModal");
const closeConfirmationModal = document.getElementById("closeConfirmationModal");

openRegisterModal.onclick = () => {
  window.itemToEdit = null;
  registerModal.style.display = "block";

  document.getElementById("registerForm").reset();

  // Show quantity, hide status
  document.getElementById("quantityContainer").style.display = "block";
  document.getElementById("statusContainer").style.display = "none";
};

openReportModal.onclick = () => reportSelectionModal.style.display = "block";

closeRegisterModal.onclick = () => registerModal.style.display = "none";
closeNotification.onclick = () => notificationModal.style.display = "none";
closeReportModal.onclick = () => reportSelectionModal.style.display = "none";
closeConfirmationModal.onclick = () => confirmationModal.style.display = "none";

window.onclick = (event) => {
  if (event.target === registerModal) registerModal.style.display = "none";
  if (event.target === notificationModal) notificationModal.style.display = "none";
  if (event.target === confirmationModal) confirmationModal.style.display = "none";
  if (event.target === reportSelectionModal) reportSelectionModal.style.display = "none";
};

const printQRButton = document.getElementById("openPrintQRWindow");

if (printQRButton) {
  printQRButton.addEventListener("click", generateAndPrintQR);
} else {
  console.error("Print QR button not found!");
}

const printReportBtn = document.getElementById("printReport");

if (printReportBtn) {
  printReportBtn.addEventListener("click", generateAndPrintReport);

} else {
  console.error("Print Report button not found!");
}