import { populateTransaction, createAccount, getAccounts } from '../index.js';

export async function bindSuperadminModalEvents() {
    const addAccountModal = document.getElementById("addAccount");
    const opentransaction = document.getElementById("transaction");
    const registerUserForm = document.getElementById("registerUserForm");
    const openManageUser = document.getElementById("manage-users-button");
    const manageUsers = document.getElementById("manage-users-modal");
    const closeCreateAccountModal = document.getElementById("closeAddAccountModal");
    const closeTransactionModal = document.getElementById("closeTransactionModal");
    const closeManageUser = document.getElementById("closeManageUsersModal");

    const openCreateBtn = document.getElementById("create-account-button");
    const openTransactionBtn = document.getElementById("transaction-button");

    closeCreateAccountModal.onclick = () => addAccountModal.style.display = "none";
    closeTransactionModal.onclick = () => opentransaction.style.display = "none";
    closeManageUser.onclick = () => manageUsers.style.display = "none";

    openCreateBtn.addEventListener("click", () => {
      addAccountModal.style.display = "block";
    });

    openTransactionBtn.addEventListener("click", () => {
      populateTransaction(); 
      opentransaction.style.display = "block";
    });

    openManageUser.addEventListener("click", () => {
      getAccounts();
      manageUsers.style.display = "block";
    });

    const phoneInput = document.getElementById("phoneNumber");
    phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 11) {
      this.value = this.value.slice(0, 11);
    }
  });

  if (registerUserForm) {
    registerUserForm.addEventListener("submit", async (event) => {
      event.preventDefault(); 
      await createAccount(event);
      addAccount.style.display = "none"
      });
    } else {
      console.error("Create Account not found.");
    }
}