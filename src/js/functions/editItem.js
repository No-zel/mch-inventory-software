import { getProducts, showNotification, toSentenceCase } from '../index.js';

export async function editItem(event, itemId) {
const user = localStorage.getItem("user");
const formData = new FormData(event.target);

const updatedItem = {
  id: itemId,
  productName: toSentenceCase(formData.get("productName")),
  department: formData.get("department"),
  serial_number: formData.get("serialNumber"), 
  category: toSentenceCase(formData.get("category")),
  subCategory: toSentenceCase(formData.get("subcategory")),
  status: formData.get("status"), 
  assignedTo: toSentenceCase(formData.get("assigned_to")),
  username: user,
};
  try {
    const { response, error } = await window.api.request({
      method: "patch",
      url: "/item/update/",
      bodyObj: updatedItem
    });

    if (error) {
      console.error("API Error:", error);
      return;
    }
    if (response) {
      showNotification("Item Updated successfully!");
      getProducts(); 
    } else {
      console.error("Unexpected response:", response?.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
