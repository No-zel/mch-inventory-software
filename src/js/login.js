document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const { data } = await window.api.request({
        method: "post",
        url: "/account/login/",
        bodyObj: { 
          username: username, 
          password: password 
        },
      });
      if (data.token) {
        await auth.setToken(data.token);
        window.location.href = "table.html";
      } else {
        alert("Login failed");
        return
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  });
});
