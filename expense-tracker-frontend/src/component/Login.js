// Login.js
import React, { useState } from "react";
import { fetchAPI } from "../util/apiUtils";
import { useNavigate } from "react-router-dom";

function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // instantiate the hook

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchAPI("login.php", "POST", { account, password });
      if (data.success) {
        navigate("/main");
      } else {
        setErrorMessage(data.message || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to login. Please try again.");
    }
  };

  return (
    <div>
      <h4>Login</h4>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="e.g. abcd101"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" type="submit">
          Login
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
      {errorMessage && <div className="error-msg">{errorMessage}</div>}
    </div>
  );
}

export default Login;
