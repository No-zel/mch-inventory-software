import { populateTable, showNotification, populateDataCounter } from '../index.js';

export async function deleteItem(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const loadingIndicator = document.getElementById("loading");
  if (!id) return console.error("No ID provided for deletion");
    // const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
    // let itemsToDelete = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);
    loadingIndicator.style.display = "flex";
    try {
      const {data, error, status} = await window.api.request({
        method: "delete",
        url: "/item/delete/", 
        bodyObj: {
          id: id,
          username: user.username,
        }
      });
  
      if (error) {
        console.error("Request Error:", error);
        showNotification("Failed to delete item!", "error");
        return;
    }
  
    if (status === 200) {
        showNotification("Item deleted successfully.");
        window.allItems = window.allItems.filter(product => !id.includes(product.id));
        populateTable(window.allItems);
        populateDataCounter();
      } else {
          console.error("Unexpected response:", error);
          showNotification(`Failed to delete item!`, error);
      }
  
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      loadingIndicator.style.display = "none";
    }
}