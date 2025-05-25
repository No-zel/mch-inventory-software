const options = {
  baseUrl: "http://192.168.100.9:5001/mch/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

class APIRequest {
  async get({ url, token = null }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "GET",
        headers: {
          ...options.headers,
          ...(token ? { "auth-token": token } : {}),
        },
      });
      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async post({ url, bodyObj = {}, token = null }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "POST",
        headers: {
          ...options.headers,
          ...(token ? { "auth-token": token } : {}),
        },
        body: JSON.stringify(bodyObj),
      });
      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async patch({ url, bodyObj = {}, token = null }) {
    try {
      const response = await fetch(`${options.baseUrl}${url}`, {
        method: "PATCH",
        headers: {
          ...options.headers,
          ...(token ? { "auth-token": token } : {}),
        },
        body: JSON.stringify(bodyObj),
      });
      return await this.handleResponse(response);
    } catch (err) {
      return this.handleError(err);
    }
  }

  async delete({ url, bodyObj, token = null }) {
    try {
        const response = await fetch(`${options.baseUrl}${url}`, {
            method: "DELETE",
            headers: {
              ...options.headers,
              ...(token ? { "auth-token": token } : {}),
            },
            body: JSON.stringify(bodyObj),
        });
      return await this.handleResponse(response);
    } catch (err) {
        console.error("Request Error:", err);
      return { response: null, data: null, error: err.message }; 
    }
}

// async handleResponse(response) {
//   if (!response.ok) {
//       return {
//           response,
//           data: null,
//           error: `HTTP Error: ${response.status} ${response.statusText}`,
//       };
//   }

//   try {
//       // Check if response has a body
//       const text = await response.text();
//       const json = text ? JSON.parse(text) : null;  // Avoid JSON parsing error on empty response

//       return { response, data: json };
//   } catch (err) {
//       console.error("JSON Parsing Error:", err);
//       return {
//           response,
//           data: null,
//           error: "Failed to parse JSON response",
//       };
//   }
// }

async handleResponse(response) {
  const text = await response.text();
  let json = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("JSON Parsing Error:", err);
    return {
      response,
      data: null,
      error: "Invalid JSON response",
      message: null,
      status: response.status
    };
  }

  if (!response.ok) {
    return {
      response,
      data: null,
      error: json?.message || `HTTP Error: ${response.status} ${response.statusText}`,
      message: json?.message || null,
      status: response.status
    };
  }

  return {
    response,
    data: json,
    error: null,
    message: json?.message || null,
    status: response.status
  };
}


  handleError(err) {
    console.error("Request Error:", err);
    return { response: null, data: null, error: err.message };
  }
}

module.exports = { APIRequest };