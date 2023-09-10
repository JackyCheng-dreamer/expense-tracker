import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import ExpenseTracker from "./component/ExpenseTracker";
import { fetchAPI } from "./util/apiUtils";

function RoutesWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function checkSession() {
      try {
        const response = await fetchAPI("checkSession.php");
        if (response.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        setIsAuthenticated(false);
      }
    }

    checkSession();
  }, [location]);

  if (isAuthenticated === null) {
    return <div>Checking session...</div>;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/main" element={<ExpenseTracker />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <RoutesWrapper />
    </Router>
  );
}

export default App;
