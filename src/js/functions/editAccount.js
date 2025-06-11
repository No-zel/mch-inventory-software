import {  showNotification  } from '../index.js';

export async function editAccount(event, accId) {
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData(event.target);
    const loadingIndicator = document.getElementById("loading");

    if (formData.get("password") !== formData.get("repassword")) {
        showNotification("Password not match");
        return;
    }

    const updatedItem = {
      id: accId,
      username: formData.get("username"),
      password: formData.get("password"), 
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      department: formData.get("accdepartment"), 
      role: formData.get("role"),
      phone_num: formData.get("phoneNumber"),
      email: formData.get("email"),    
      permission: user.username,
    };
    loadingIndicator.style.display = "flex";

    try {
        const { response, error } = await window.api.request({
            method: "patch",
            url: "/account/profile/update/",
            bodyObj: updatedItem
        });

        if (error) {
            console.error("API Error:", error);
            return;
        }
        if (response) {
            showNotification("Account Updated successfully!");
        } else {
            console.error("Unexpected response:", response?.status);
        }
    } catch (err) {
        console.error("Fetch error:", err);
    } finally {
        loadingIndicator.style.display = "none";
    }
}