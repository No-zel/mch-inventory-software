import { populateManageUsers } from '../index.js';

export async function getAccounts() {
    let usercatch = null;

    if (!usercatch) {
      try {
        const {data, status} = await window.api.request({
          method: "get",
          url: "/accounts/find/",
        });

        if (data.data) {
          usercatch = data.data
          populateManageUsers(usercatch)
        } else {
          console.error("Unexpected response:", status);
          return;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        return;
      }
    } else {
      populateManageUsers(usercatch)
    }
  }