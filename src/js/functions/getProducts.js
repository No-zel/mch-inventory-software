import { populateTable } from '../index.js';

export async function getProducts() {
    try {
      const {response, data, error} = await window.api.request({
        method: "get",
        url: "/item/find/",
      });
  
      if (error) {
        console.error("API Error:", error);
        return;
      }
  
      if (data.status === 200) {
        window.allItems = data.data; 
        populateTable(window.allItems);
      } else {
        console.error("Unexpected response:", response?.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }