import { populateTable, populateDataCounter } from '../index.js';

export async function getProducts() {
    try {
      const {response, data, error, status} = await window.api.request({
        method: "get",
        url: "/item/find/",
      });

      if (error) {
        window.allItems = 0;
        console.error("API Error:", error);
        return;
      }
  
      if (status === 200) {
        window.allItems = data.data; 
        populateTable(window.allItems);
        populateDataCounter()
      } else {
        console.error("Unexpected response:", response?.status);
        return;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      return;
    }
  }