// apiUtils.js

const BASE_URL = "http://localhost:8080/api/";

export const fetchAPI = async (endpoint, method = "GET", body = null) => {
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // send cookies with cross-origin requests
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(BASE_URL + endpoint, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong!");
  }

  return data;
};

// checking if there's user login for this app already
export async function checkSession() {
  const response = await fetchAPI("checkSession.php", "POST");
  const data = await response.json();
  return data;
}