import { showNotification } from './index.js'

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loadingIndicator = document.getElementById("loading");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    loadingIndicator.style.display = "flex";
    try {
      const { data, error } = await window.api.request({
        method: "post",
        url: "/account/login",
        bodyObj: { 
          username: username, 
          password: password 
        },
      });

      if (error) {
        console.log(error)
        showNotification(error);
        document.getElementById("password").value = "";
        return;
      } 

      if (data.data.role === "user") {
        showNotification("You need admin permission.");
        document.getElementById("password").value = "";
        return;
      }

      await auth.setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.data));
      window.location.href = "table.html";
    } catch (error) {
      console.error("Login error:", error);
      showNotification(error);
      document.getElementById("password").value = "";
      return;
    } finally {
      loadingIndicator.style.display = "none";
    }
  });
});

const closeNotification = document.getElementById("closeNotification");
closeNotification.onclick = () => notificationModal.style.display = "none";