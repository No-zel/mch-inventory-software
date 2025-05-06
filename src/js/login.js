import { showNotification } from './index.js'

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
      } else {
        await auth.setToken(data.token);
        window.location.href = "table.html";
        console.log(data.token)
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification(error);
      document.getElementById("password").value = "";
      return;
    }
  });
});

const closeNotification = document.getElementById("closeNotification");
closeNotification.onclick = () => notificationModal.style.display = "none";