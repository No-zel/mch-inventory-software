import { getProducts, showNotification, toSentenceCase } from '../index.js';

export async function editItem(event, itemId) {

const formData = new FormData(event.target);

const updatedItem = {
  id: itemId,
  productName: toSentenceCase(formData.get("productName")),
  department: formData.get("department"),
  serialNumber: formData.get("serialNumber"), 
  category: toSentenceCase(formData.get("category")),
  subCategory: toSentenceCase(formData.get("subcategory")),
  status: formData.get("status"), 
  assignedTo: toSentenceCase(formData.get("assigned_to")),
};


  console.log("req body:", updatedItem);

  try {
    const { response, error } = await window.api.request({
      method: "patch",
      url: "/item/update/",
      bodyObj: updatedItem
    });

    console.log(response);

    if (error) {
      console.error("API Error:", error);
      return;
    }
    if (response) {
      showNotification("Item Updated successfully!");
      getProducts(); // make sure this is defined globally or passed in
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
