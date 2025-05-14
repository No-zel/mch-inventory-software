import { getProducts, showNotification, toSentenceCase } from '../index.js';

export async function createItem(event) {
  
  let productNameValue = toSentenceCase(document.getElementById("productName").value);
  let serial_numberValue = document.getElementById("serialNumber").value;
  let DepartmentValue = document.getElementById("department").value;
  let CategoryValue = toSentenceCase(document.getElementById("category").value);
  let SubCategoryValue = toSentenceCase(document.getElementById("subcategory").value);
  let QuantityValue = parseInt(document.getElementById("quantity").value, 10);
  let assignedToValue = toSentenceCase(document.getElementById("assigned_to").value);
  const user = localStorage.getItem("user");
  const loadingIndicator = document.getElementById("loading");

  const requestBody = {
    serial_number: serial_numberValue,
    productName: productNameValue,
    department: DepartmentValue,
    category: CategoryValue,
    subCategory: SubCategoryValue,
    quantity: QuantityValue,
    assignedTo: assignedToValue,
    username: user,
  };
  loadingIndicator.style.display = "flex";
  try {
    const { response, error } = await window.api.request({
      method: "post",
      url: "/item/create/",
      bodyObj: requestBody
    });

    if (error) {
      console.error("API Error:", error);
      return;
    }
    if (response) {
      showNotification("Item added successfully.");
      getProducts(); 
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    loadingIndicator.style.display = "none";
  }
}
