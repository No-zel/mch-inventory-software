import { APIRequest } from "../utils/request";

const api = new APIRequest();

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const { data } = await api.post({
        url: "/login",
        bodyObj: { username, password },
      });

      if (data.token) {
        await window.auth.saveToken(data.token); // Securely save token
        window.location.href = "index.html";
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  });
});
