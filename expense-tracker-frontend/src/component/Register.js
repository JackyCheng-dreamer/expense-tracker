// Register.js
import React, { useState } from "react";
import { fetchAPI } from "../util/apiUtils";
import { useNavigate } from "react-router-dom";
function Register() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetchAPI("register.php", "POST", {
        account,
        password,
        userName,
      });
      if (response.status === "success") {
        alert(
          "Registration Successful! Now you will be redirected to the main page."
        );
        navigate("/main"); // <-- use navigate here
      } else {
        // Use the error message from the server, if provided, otherwise use a default message
        setErrorMessage(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  return (
    <div>
      <h4>Register</h4>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="Account"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="UserName"
        />
        <button className="btn" type="submit">
          Register
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </form>
      {errorMessage && <div className="error-msg">{errorMessage}</div>}
    </div>
  );
}

export default Register;
