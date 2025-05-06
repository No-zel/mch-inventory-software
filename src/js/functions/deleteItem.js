import { getProducts, showNotification } from '../index.js';

export async function deleteItem(id) {

  if (!id) return console.error("No ID provided for deletion");
    // const selectedItems = [...document.querySelectorAll(".select-item:checked")].map(checkbox => checkbox.dataset.id);
    // let itemsToDelete = selectedItems.length > 0 ? selectedItems : [...document.querySelectorAll(".select-item")].map(checkbox => checkbox.dataset.id);

    console.log(id)
    try {
      const {data, error} = await window.api.request({
        method: "delete",
        url: "/item/delete/", 
        bodyObj: id
      });
  
      if (error) {
        console.error("Request Error:", error);
        showNotification("Failed to delete item!", "error");
        return;
    }
  
    if (data.status === 200) {
          showNotification("Item deleted successfully.");
          getProducts();
      } else {
          console.error("Unexpected response:", error);
          showNotification(`Failed to delete item!`, error);
      }
  
    } catch (err) {
      console.error("Fetch error:", err);
    }
    console.log(id)
}