import React, { useState, useEffect } from "react";
import { fetchAPI } from "../util/apiUtils";
import CategorySelect from "./ExpenseTracker_component/CategorySelect";
import ExpenseChart from "./ExpenseTracker_component/ExpenseChart";
import BudgetSection from "./ExpenseTracker_component/BudgetSection";
import { useNavigate } from "react-router-dom";

function ExpenseTracker() {
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await fetchAPI("getTransactions.php");
        if (data.status === "success") {
          setTransactions(data.transactions);
        } else {
          setErrorMessage(data.message || "Failed to fetch transactions.");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching transactions.");
        console.error("Error:", error);
      }
    }

    fetchTransactions();
  }, []);

  const totalIncome = transactions.reduce(
    (acc, transaction) =>
      transaction.amount > 0 ? acc + transaction.amount : acc,
    0
  );
  const totalExpense = transactions.reduce(
    (acc, transaction) =>
      transaction.amount < 0 ? acc + transaction.amount : acc,
    0
  );

  const getTransactionSign = (amount) => (amount < 0 ? "-" : "+");
  const getTransactionClass = (amount) => (amount < 0 ? "minus" : "plus");

  const handleRemoveTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions);
  };
  const handleAddTransaction = async () => {
    try {
      const transaction = {
        text: category,
        amount: amount,
        category: category,
      };

      const data = await fetchAPI("addTransaction.php", "POST", transaction);

      if (data.status === "success") {
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          transaction,
        ]);
      } else {
        setErrorMessage(data.message || "Failed to add transaction.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding transaction.");
      console.error("Error:", error);
    }
  };

  const generateReport = () => {
    fetchAPI("generateReport.php", "GET", null, false)
      .then((data) => {
        if (data instanceof Blob) {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = "ExpenseTrackerReport.pdf";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        } else if (data.status === "error") {
          throw new Error(data.message || "Network error");
        }
      })
      .catch((error) => {
        setErrorMessage("An error occurred while generating a report.");
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h2>Expense Tracker</h2>
      <BudgetSection />

      <div className="container">
        <h4>Your Balance</h4>
        <h1 id="balance">${totalIncome + totalExpense}</h1>

        <div className="inc-exp-container">
          <div>
            <h4>Income</h4>
            <p id="money-plus" className="money plus">
              ${totalIncome}
            </p>
          </div>
          <div>
            <h4>Expense</h4>
            <p id="money-minus" className="money minus">
              ${Math.abs(totalExpense)}
            </p>
          </div>
        </div>

        <ExpenseChart transactions={transactions} />
      </div>

      {errorMessage && <div className="error-msg">{errorMessage}</div>}

      <div>
        <CategorySelect
          selectedCategory={category}
          onCategoryChange={setCategory}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          placeholder="Amount"
        />
        <button className="btn" onClick={handleAddTransaction}>
          Add Transaction
        </button>
        <button className="report-btn" onClick={generateReport}>
          Generate Report
        </button>
      </div>

      <ul className="list">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={getTransactionClass(transaction.amount)}
          >
            {transaction.text}
            <span>
              {getTransactionSign(transaction.amount)}$
              {Math.abs(transaction.amount)}
            </span>
            <button
              className="delete-btn"
              onClick={() => handleRemoveTransaction(transaction.id)}
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseTracker;
