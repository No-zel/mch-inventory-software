import { getProducts, showNotification, toSentenceCase } from '../functions/index.js';

export async function createItem(event) {
  
  let productNameValue = toSentenceCase(document.getElementById("productName").value);
  let serialNumberValue = document.getElementById("serialNumber").value;
  let DepartmentValue = document.getElementById("department").value;
  let CategoryValue = toSentenceCase(document.getElementById("category").value);
  let SubCategoryValue = toSentenceCase(document.getElementById("subcategory").value);
  let QuantityValue = parseInt(document.getElementById("quantity").value, 10);
  let assignedToValue = toSentenceCase(document.getElementById("assigned_to").value);
  

  const requestBody = {
    serialNumber: serialNumberValue,
    productName: productNameValue,
    department: DepartmentValue,
    category: CategoryValue,
    subCategory: SubCategoryValue,
    quantity: QuantityValue,
    assignedTo: assignedToValue
  };

  console.log("req body:", requestBody);

  try {
    const { response, error } = await window.api.request({
      method: "post",
      url: "/item/create/",
      bodyObj: requestBody
    });

    console.log(response);

    if (error) {
      console.error("API Error:", error);
      return;
    }
    if (response) {
      showNotification("Item added successfully!");
      getProducts(); // make sure this is defined globally or passed in
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
