import { populateTable, populateDataCounter } from '../index.js';

export async function getProducts() {
  const loadingIndicator = document.getElementById("loading");

    loadingIndicator.style.display = "flex";
    try {
      const {response, data, error, status} = await window.api.request({
        method: "get",
        url: "/item/find/",
      });

      if (status === 200) {
        window.allItems = data.data; 

        if (window.allItems.length === 0) {
          console.info("No items found.");
        }
        populateTable(window.allItems);
        populateDataCounter()
      } else {
        console.error("Unexpected response:", status);
        return;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      return;
    } finally {
      loadingIndicator.style.display = "none";
    }
  }