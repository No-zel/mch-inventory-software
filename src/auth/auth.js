// const { session } = require("electron");

// const AUTH_KEY = "authToken";

// class Auth {
//   static async saveToken(token) {
//     const ses = session.defaultSession;
//     await ses.cookies.set({
//       url: "http://localhost",
//       name: AUTH_KEY,
//       value: token,
//       httpOnly: true,
//       secure: true,
//     });
//   }

//   static async getToken() {
//     const ses = session.defaultSession;
//     const cookies = await ses.cookies.get({ url: "http://localhost", name: AUTH_KEY });
//     return cookies.length ? cookies[0].value : null;
//   }

//   static async clearToken() {
//     const ses = session.defaultSession;
//     await ses.cookies.remove("http://localhost", AUTH_KEY);
//   }
// }

// module.exports = Auth;
