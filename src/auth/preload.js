const { contextBridge, ipcRenderer } = require("electron");
const QRCode = require("qrcode").default || require("qrcode");

console.log("✅ Preload script loaded successfully!");

try {
  console.log("Testing QR Code module...");
  QRCode.toDataURL("test")
    .then((url) => console.log("✅ QR Code module is working!", url))
    .catch((err) => console.error("❌ QR Code test failed:", err));
} catch (error) {
  console.error("❌ Error loading QRCode module:", error);
}


contextBridge.exposeInMainWorld("api", {
  request: async ({ method, url, bodyObj = {} }) => {
    try {
      return await ipcRenderer.invoke("APIRequest", { method, url, bodyObj });
    } catch (error) {
      console.error("API request error:", error);
      return { error: "API request failed" };
    }
  },
});

contextBridge.exposeInMainWorld("qr", {
  generate: async (data) => {
    try {
      return await ipcRenderer.invoke("generateQRCode", data);
    } catch (error) {
      console.error("QR Code generation error:", error);
      return null;
    }
  },
});
