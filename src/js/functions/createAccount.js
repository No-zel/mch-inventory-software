import { showNotification } from '../index.js';
const user = JSON.parse(localStorage.getItem("user"));

export async function createAccount(event) {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let repassword = document.getElementById("repassword").value;
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let accdepartment = document.getElementById("accdepartment").value;
    let role = document.getElementById("role").value;
    let phoneNumber = document.getElementById("phoneNumber").value;
    let email = document.getElementById("email").value;
    const loadingIndicator = document.getElementById("loading");

    if (password !== repassword) {
        showNotification("Password not match.");
        password = "";
        repassword = "";
        return;
    }

    if (username.includes(" ")) {
        showNotification("Username contains a space");
        username = "";
        return;
    }

  const requestBody = {
    username: username,
    password: password,
    first_name: firstName,
    last_name: lastName,
    department: accdepartment,
    role: role,
    phone_num: phoneNumber,
    email: email,
    permission: user.username
  };
  loadingIndicator.style.display = "flex";
  try {
    const { response, error } = await window.api.request({
      method: "post",
      url: "/account/create/",
      bodyObj: requestBody
    });

    if (error) {
      showNotification(error);
      return;
    }
    if (response) {
      showNotification("Account Added.");
    } else {
      showNotification(response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    loadingIndicator.style.display = "none";
  }
}