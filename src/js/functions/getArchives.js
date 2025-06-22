import { populateArchiveModal } from '../index.js';

export async function getArchives() {

    if (!window.archiveItems) {
      try {
        const {data, status} = await window.api.request({
          method: "get",
          url: "/item/find/archives",
        });
        if (data.data) {
          window.archiveItems = data.data
          populateArchiveModal(window.archiveItems)
        } else {
          console.error("Unexpected response:", status);
          return;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        return;
      }
    } else {
      populateArchiveModal(window.archiveItems)
    }
  }