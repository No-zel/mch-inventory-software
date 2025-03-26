async function fetchData() {
    try {
      const response = await fetch("http://192.168.100.10:5001/mch/v1/item/find/");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API Request Error:", error.message);
      return { error: error.message };
    }
  }
  
  module.exports = { fetchData };