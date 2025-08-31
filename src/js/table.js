import { 
  createItem, 
  deleteItem, 
  editItem, 
  generateAndPrintQR, 
  generateAndPrintReport, 
  getProducts, populateTable, 
  clearReportModal, 
  populateDepartmentModal, 
  clearFilterModal,  
  showNotification, 
  populateDataCounter, 
  populateOverviewModal, 
  clearoverviewModal,
  exportData,
  applyFilter,
  bindSuperadminModalEvents,
  editAccount,
  deleteAccount,
  createAccount
} from './index.js';

if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isSuperAdmin = user && user.role === "superadmin";

  function loadSuperadminModals() {
    const tmpl = document.getElementById('super-admin-buttons');
    const clone = tmpl.content.cloneNode(true);
    document.body.appendChild(clone); 

    bindSuperadminModalEvents();
  }

  const menuButton = document.getElementById("menu");
  const menuBox = document.getElementById("menu-box");

  if (isSuperAdmin) {
    menuButton.style.display = "block";
    loadSuperadminModals()

    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menuBox.style.display === "flex") {
        menuBox.style.display = "none";
        menuButton.blur();
      } else {
        menuBox.style.display = "flex";
        menuButton.focus();
      }
    });

  document.addEventListener("click", function (e) {
      if (!menuButton.contains(e.target) && !menuBox.contains(e.target)) {
        menuBox.style.display = "none";
      }
    });
  }

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
  const registerForm = document.getElementById("registerForm");
  const registerUserForm = document.getElementById("registerUserForm")

    if (confirmChoice) {
      confirmChoice.onclick = async () => {
        if (window.itemToDelete) {
          await deleteItem([window.itemToDelete]);
          window.itemToDelete = null;
        } else if (window.accountToDelete) {
          await deleteAccount(window.accountToDelete);
          window.accountToDelete = null;
        }

        confirmationModal.style.display = "none";
      };
    }

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
    } 
    if (registerUserForm) {
      registerUserForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 

        if (window.accountToEdit) {
          console.log(window.accountToEdit)
          await editAccount(event, window.accountToEdit);
          window.accountToEdit = null;
        } else {
          await createAccount(event);
        }
        registerUserForm.reset();
        addAccount.style.display = "none"
      });
    } else {
      console.error("Register form not found.");
    }

});

document.addEventListener("delete-item", (e) => {
  const itemIdToDelete = e.detail.id;
  window.itemToDelete = itemIdToDelete;
  confirmationModal.style.display = "block";
});

document.addEventListener("edit-item", (e) => {
  const itemIdToEdit = e.detail.id?.[0];
  const dateOnly = itemIdToEdit.created_at.slice(0, 10)
  window.itemToEdit = itemIdToEdit.id;
  if (itemIdToEdit) {
    document.getElementById("productName").value = itemIdToEdit.productName;
    document.getElementById("department").value = itemIdToEdit.department;
    document.getElementById("serialNumber").value = itemIdToEdit.serial_number;
    document.getElementById("category").value = itemIdToEdit.category;
    document.getElementById("subcategory").value = itemIdToEdit.subCategory;
    document.getElementById("status").value = itemIdToEdit.status || "available";
    document.getElementById("date").value = dateOnly;
    document.getElementById("assigned_to").value = itemIdToEdit.assignedTo;

    document.getElementById("statusContainer").style.display = "block";
    document.getElementById("quantityContainer").style.display = "none";

    document.getElementById("addContainer").style.display = "none";
    document.getElementById("updateContainer").style.display = "block";
  }
  registerModal.style.display = "block";
});

document.addEventListener("delete-account", (e) => {
  const accountIdToDelete = e.detail.id;
  window.accountToDelete = accountIdToDelete;
  confirmationModal.style.display = "block";
});

document.addEventListener("edit-account", (e) => {
  const accountIdToEdit = e.detail.id?.[0];
  window.accountToEdit = accountIdToEdit.id;
  if (accountIdToEdit) {
    document.getElementById("username").value = accountIdToEdit.username;
    document.getElementById("password").value = "";
    document.getElementById("repassword").value = "";
    document.getElementById("firstName").value = accountIdToEdit.first_name;
    document.getElementById("lastName").value = accountIdToEdit.last_name;
    document.getElementById("accdepartment").value = accountIdToEdit.department;
    document.getElementById("role").value = accountIdToEdit.role;
    document.getElementById("phoneNumber").value = accountIdToEdit.phone_num;
    document.getElementById("email").value = accountIdToEdit.email;

    document.getElementById("add-account").style.display = "none";
    document.getElementById("update-account").style.display = "block";
  }
  const addAccountModal = document.getElementById("addAccount");
  addAccountModal.style.display = "block";
});


const registerModal = document.getElementById("registerModal");
const notificationModal = document.getElementById("notificationModal");
const confirmationModal = document.getElementById("confirmationModal");
const filterModal = document.getElementById("filterModal")
const reportSelectionModal = document.getElementById("reportSelectionModal")
// const addAccountModal = document.getElementById("addAccount")
// const opentransaction = document.getElementById("transaction")
const overviewModal = document.getElementById("overviewModal")

const openRegisterModal = document.getElementById("openRegisterModal");
const loadingIndicator = document.getElementById("loading");
const closeRegisterModal = document.getElementById("closeRegisterModal");
const closeNotification = document.getElementById("closeNotification");
const closeReportModal = document.getElementById("closeReportModal");
const closeConfirmationModal = document.getElementById("closeConfirmationModal");
const closeFilterModal = document.getElementById("closeFilterModal");
const closeOverviewModal = document.getElementById("closeOverviewModal");

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    menuBox.style.display = "none";
    reportSelectionModal.style.display = "none";
    filterModal.style.display = "none";
    overviewModal.style.display = "none";
  }
});

openRegisterModal.onclick = () => {
  window.itemToEdit = null;
  registerModal.style.display = "block";

  document.getElementById("registerForm").reset();
  document.getElementById("quantityContainer").style.display = "block";
  document.getElementById("statusContainer").style.display = "none";
  document.getElementById("addContainer").style.display = "block";
  document.getElementById("updateContainer").style.display = "none";
};

closeRegisterModal.onclick = () => registerModal.style.display = "none";
closeNotification.onclick = () => notificationModal.style.display = "none";
closeReportModal.onclick = () => reportSelectionModal.style.display = "none";
closeConfirmationModal.onclick = () => confirmationModal.style.display = "none";
closeFilterModal.onclick = () => filterModal.style.display = "none";
closeOverviewModal.onclick = () => overviewModal.style.display = "none";

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

// document.getElementById("FilterForm").addEventListener("submit", (e) => {
//   e.preventDefault();

//   const selected = Array.from(document.querySelectorAll('input[name="department"]:checked'))
//     .map(input => input.value);

//   const filteredItems = selected.length === 0
//     ? window.allItems 
//     : window.allItems.filter(item => selected.includes(item.department));

//   populateTable(filteredItems);
//   populateDataCounter();
//   filterModal.style.display = "none";
// });

document.getElementById("FilterForm").addEventListener("submit", function (e) {
  applyFilter(e)
});

document.getElementById("search-input").addEventListener("input", function () {
  const query = this.value.trim().toLowerCase();

  const filtered = window.allItems.filter(item => {
    return (
      item.id.toString().toLowerCase().includes(query) ||
      item.id.toString().toLowerCase().includes(query) ||
      item.productName.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.subCategory.toLowerCase().includes(query) ||
      item.assignedTo.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  populateTable(filtered);
  populateDataCounter();
});

document.getElementById("openReportModal").addEventListener("click", function() {
  if (window.allItems == 0) {
    showNotification("Add a item first.")
    return;
  } else {
    clearReportModal()
    populateDepartmentModal("reportDepartmentContainer", "reportYearContainer");
    reportSelectionModal.style.display = "block"
  }
})

document.getElementById("openFilterModal").addEventListener("click", function() {

  if (window.allItems == 0) {
    showNotification("Add a item first.")
    return;
  } else {
    clearFilterModal()
    populateDepartmentModal("filterDepartmentContainer", "filterYearContainer");
    filterModal.style.display = "block"
  }
})

document.getElementById("openOverviewModal").addEventListener("click", function() {
  if (window.allItems == 0) {
    showNotification("Add a item first.")
    return;
  } else {
    clearoverviewModal();
    populateOverviewModal();
    overviewModal.style.display = "block"
  }

})

document.getElementById("exportData").addEventListener("click", function() {
  if (window.allItems == 0) {
    showNotification("Add a item first.")
    return;
  } else {
    exportData();
  }
})

// document.getElementById("create-account-button").addEventListener("click", function() {
//   addAccountModal.style.display = "block"
// })

// document.getElementById("transaction-button").addEventListener("click", function() {
//   populateTransaction()
//   opentransaction.style.display = "block"
// })

document.getElementById("logout-button").addEventListener("click", async function() {

  loadingIndicator.style.display = "flex";
  try {
    await auth.setToken(null); 
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
  } catch {
    showNotification("Log Out Failed")
    return;
  } finally {
    loadingIndicator.style.display = "none";
  }
})

// document.getElementById("contact-button").addEventListener("click", function() {
//   window.location.href = "http://m.me/SaphyreLight";
// })
