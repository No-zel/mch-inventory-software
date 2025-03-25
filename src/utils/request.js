const options = {
    baseUrl: "https://192.168.100.13:5001/mch/v1",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  class APIRequest {
    async getAuthHeaders(headersOption = {}) {
      const token = await window.auth.checkToken(); 
      return {
        ...options.headers,
        ...headersOption,
        ...(token ? { "auth-token": token } : {}),
      };
    }
  
    async get({ url, headersOption = {} }) {
      try {
        const response = await fetch(`${options.baseUrl}${url}`, {
          method: "GET",
          headers: await this.getAuthHeaders(headersOption),
        });
        const json = await response.json();
        return { response, data: json };
      } catch (err) {
        console.error(err);
        return { response: err, data: null };
      }
    }
  
    async post({ url, bodyObj, headersOption = {} }) {
      try {
        const response = await fetch(`${options.baseUrl}${url}`, {
          method: "POST",
          headers: await this.getAuthHeaders(headersOption),
          body: JSON.stringify(bodyObj),
        });
        const json = await response.json();
        return { response, data: json };
      } catch (err) {
        console.error("Request Error: ", err);
        return { response: err, data: null };
      }
    }
  
    async patch({ url, bodyObj, headersOption = {} }) {
      try {
        const response = await fetch(`${options.baseUrl}${url}`, {
          method: "PATCH",
          headers: await this.getAuthHeaders(headersOption),
          body: JSON.stringify(bodyObj),
        });
        const json = await response.json();
        return { response, data: json };
      } catch (err) {
        console.error("Request Error: ", err);
        return { response: err, data: null };
      }
    }
  
    async delete({ url, headersOption = {} }) {
      try {
        const response = await fetch(`${options.baseUrl}${url}`, {
          method: "DELETE",
          headers: await this.getAuthHeaders(headersOption),
        });
        const json = await response.json();
        return { response, data: json };
      } catch (err) {
        console.error("Request Error: ", err);
        return { response: err, data: null };
      }
    }
  }
  
  export { APIRequest };
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
  
  // export { options, APIRequest };
  