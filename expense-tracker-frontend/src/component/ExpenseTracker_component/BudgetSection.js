import React, { useState, useEffect } from "react";
import { fetchAPI } from "../../util/apiUtils";

function BudgetSection() {
  const [month, setMonth] = useState('01');
  const [budget, setBudget] = useState(0);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentMonthBudget, setCurrentMonthBudget] = useState(0);

  useEffect(() => {
    
  }, []);


  const getMonthList = () => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  }

  const handleSumbit = async () => {
    try {
      const data = await fetchAPI("setupBudget.php", "POST", { month, budget });
      if (data.status === "success") {
        setMessage(data.message || "Successful !");
      } else {
        setErrorMessage(data.message || "Failed to set up our budget");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Failed to set up our budget. Please try again.");
    }
  }

  return (
    <div>
      <h5>Budget Section:</h5>
      <div className="display-budget">
        <h5>Current Month Budget : {currentMonthBudget}</h5>
      </div>

      <label>
        Select Month:
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {getMonthList().map((val) => <option key={val} value={val}>{val}</option>)}
        </select>
      </label>
      <label>
        Set our Budget:
        <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}/>
      </label>

      <button onClick={handleSumbit}>Update Buget!</button>
      {message && !errorMessage && <div className="good-msg">{message}</div>}
      {errorMessage && message && <div className="error-msg">{errorMessage}</div>}
    </div>
  );
}

export default BudgetSection;
