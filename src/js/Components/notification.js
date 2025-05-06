export function showNotification(message) {
    document.getElementById("notificationMessage").textContent = message;
    notificationModal.style.display = "block";
}