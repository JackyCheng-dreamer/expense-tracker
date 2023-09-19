// apiUtils.js

const BASE_URL = "http://localhost:8080/api/";

export const fetchAPI = async (
  endpoint,
  method = "GET",
  body = null,
  headers = true
) => {
  const config = {
    method: method,
    credentials: "include", // send cookies with cross-origin requests
  };
  if (headers) {
    config.headers = {
      "Content-Type": "application/json",
    };
  }
  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + endpoint, config);

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong!");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }

  if (contentType && contentType.includes("application/pdf")) {
    return response.blob();
  } else {
    return response.json();
  }
};

// checking if there's user login for this app already
export async function checkSession() {
  const response = await fetchAPI("checkSession.php", "POST");
  const data = await response.json();
  return data;
}
