import {  showNotification, getAccounts  } from '../index.js';

export async function deleteAccount(accId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const loadingIndicator = document.getElementById("loading");

    if (!accId) return console.error("No ID provided for deletion");

    loadingIndicator.style.display = "flex";

    try {
    console.log(accId)
      const {error, status, response} = await window.api.request({
        method: "delete",
        url: "/account/profile/delete", 
        bodyObj: {
          id: accId,
          username: user.username,
        }
      });
  
      if (error) {
        console.error("Request Error:", error);
        showNotification("Failed to delete Account!", error);
        return;
      }
      if (status === 200) {
        getAccounts();
        showNotification("Account deleted successfully.");
      } else {
        console.error("Unexpected response:", error);
        showNotification(`Failed to delete Account!`, error);
      }
    
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      loadingIndicator.style.display = "none";
    }
}