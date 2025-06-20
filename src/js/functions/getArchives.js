import { populateArchiveModal } from '../index.js';

export async function getArchives() {
    let archive = null;

    if (!usercatch) {
      try {
        const {data, status} = await window.api.request({
          method: "get",
          url: "/item/find/archives",
        });
        if (data.data) {
          archive = data.data
          populateArchiveModal(archive)
        } else {
          console.error("Unexpected response:", status);
          return;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        return;
      }
    } else {
      populateArchiveModal(archive)
    }
  }