document.addEventListener("DOMContentLoaded", async () => {
  if (!window.api || !window.api.request) {
    console.error("Error: window.api.request is undefined. Check preload.js.");
    return;
  }

  async function getProducts() {
    try {
      const {response, data, error} = await window.api.request({
        method: "get",
        url: "/item/find/",
      });

      if (error) {
        console.error("API Error:", error);
        return;
      }

      if (data.message === "Success") {
        populateTable(data.data);
      } else {
        console.error("Unexpected response:", response?.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function populateTable(items) {
    const tableBody = document.getElementById("table-body");

    tableBody.innerHTML = "";

    items.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td><input type="checkbox" class="select-item" data-id="${item.id}"></td>
        <td>${item.id}</td>
        <td>${item.productname}</td>
        <td>${item.department}</td>
        <td>${item.category}</td>
        <td>${item.status}</td>
        <td>${item.assigned_to}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  getProducts();
  
});

var modal = document.getElementById("myModal");

var openModalBtn = document.getElementById("openModalBtn");

var closeModalBtn = document.getElementById("closeModalBtn");

openModalBtn.onclick = function() {
  modal.style.display = "block";
}

closeModalBtn.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

async function createItem() {
  try {
    const {response, data, error} = await window.api.request({
      method: "post",
      url: "/item/create/",
    });

    if (error) {
      console.error("API Error:", error);
      return;
    }

    if (data.message === "Success") {
      populateTable(data.data);
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
// // const { APIRequest } = require("../utils/request"); 
// const api = window.api.request;

// async function getProducts() {
//   try {
//     const { response, data } = await api.get({
//       url: `/item/find/`,
//     });

//     if (response?.status === 200) {
//       populateTable(data.data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// function populateTable(items) {
//   const tableBody = document.getElementById("table-body");

//   tableBody.innerHTML = "";

//   items.forEach((item) => {
//     const row = document.createElement("tr");

//     row.innerHTML = `
//       <td><input type="checkbox" class="select-item" data-id="${item.id}"></td>
//       <td>${item.id}</td>
//       <td>${item.name}</td>
//       <td>${item.department}</td>
//       <td>${item.category}</td>
//       <td>${item.status}</td>
//       <td>${item.assigned_to}</td>
//     `;

//     tableBody.appendChild(row);
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   getProducts();
// });
