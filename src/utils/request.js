const options = {
  baseUrl: "http://192.168.2.22:5001/mch/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

class APIRequest {
  async get({ url }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "GET",
        headers: options.headers,
      });

      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async post({ url, bodyObj = {} }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "POST",
        headers: options.headers,
        body: JSON.stringify(bodyObj),
      });
  
      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async patch({ url, bodyObj = {} }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "PATCH",
        headers: options.headers,
        body: JSON.stringify(bodyObj),
      });

      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async delete({ url }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "DELETE",
        headers: options.headers,
      });

      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async handleResponse(response) {
    if (!response.ok) {
      return {
        response,
        data: null,
        error: `HTTP Error: ${response.status} ${response.statusText}`,
      };
    }
  
    try {
      const json = await response.json(); 
      return { response, data: json };
    } catch (err) {
      console.error("JSON Parsing Error:", err);
      return {
        response,
        data: null,
        error: "Failed to parse JSON response",
      };
    }
  }

  handleError(err) {
    console.error("Request Error:", err);
    return { response: null, data: null, error: err.message };
  }
}

module.exports = { APIRequest };
// --------------------
// const options = {
//     baseUrl: "http://192.168.100.10:5001/mch/v1",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   };

//   class APIRequest {
//     async get({ url = {} }) {
//       try {
//         const response = await fetch(`${options.baseUrl}${url}`, {
//           method: "GET",
//         });
//         const json = await response.json();
//         return { response, data: json };
//       } catch (err) {
//         console.error(err);
//         return { response: err, data: null };
//       }
//     }
  
//     async post({ url, bodyObj = {} }) {
//       try {
//         const response = await fetch(`${options.baseUrl}${url}`, {
//           method: "POST",
//           body: JSON.stringify(bodyObj),
//         });
//         const json = await response.json();
//         return { response, data: json };
//       } catch (err) {
//         console.error("Request Error: ", err);
//         return { response: err, data: null };
//       }
//     }
  
//     async patch({ url, bodyObj = {} }) {
//       try {
//         const response = await fetch(`${options.baseUrl}${url}`, {
//           method: "PATCH",
//           body: JSON.stringify(bodyObj),
//         });
//         const json = await response.json();
//         return { response, data: json };
//       } catch (err) {
//         console.error("Request Error: ", err);
//         return { response: err, data: null };
//       }
//     }
  
//     async delete({ url = {} }) {
//       try {
//         const response = await fetch(`${options.baseUrl}${url}`, {
//           method: "DELETE",
//         });
//         const json = await response.json();
//         return { response, data: json };
//       } catch (err) {
//         console.error("Request Error: ", err);
//         return { response: err, data: null };
//       }
//     }
//   }
  
//   module.exports = { APIRequest };

  // class APIRequest {
  //   async get({ url, headersOption }) {
  //     try {
  //       const response = await fetch(`${options.baseUrl}${url}`, {
  //         method: "GET",
  //         headers: {
  //           ...headersOption,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       const json = await response.json();
  //       return { response: response, data: json };
  //     } catch (err) {
  //       console.error(err);
  //       return { response: err, data: null };
  //     }
  //   }
  
  //   async post({ url, bodyObj, headersOption }) {
  //     try {
  //       const response = await fetch(`${options.baseUrl}${url}`, {
  //         method: "POST",
  //         headers: {
  //           ...headersOption,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ...bodyObj,
  //         }),
  //       });
  //       const json = await response.json();
  //       return { response: response, data: json };
  //     } catch (err) {
  //       console.error("Request Error: ", err);
  //       return { response: err, data: null };
  //     }
  //   }
  
  //   async patch({ url, bodyObj, headersOption }) {
  //     try {
  //       const response = await fetch(`${options.baseUrl}${url}`, {
  //         method: "PATCH",
  //         headers: {
  //           ...headersOption,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ...bodyObj,
  //         }),
  //       });
  //       const json = await response.json();
  //       return { response: response, data: json };
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  
  //   async delete({ url, bodyObj, headersOption }) {
  //     try {
  //       const response = await fetch(`${options.baseUrl}${url}`, {
  //         method: "DELETE",
  //         headers: {
  //           ...headersOption,
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           ...bodyObj,
  //         }),
  //       });
  //       const json = await response.json();
  //       return { response: response, data: json };
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  // }
  
  //  module.exports = { APIRequest };
  