import { Pie } from "react-chartjs-2";
import { useState, useEffect } from "react";
import { Chart, ArcElement, PieController } from "chart.js";
Chart.register(ArcElement, PieController);

function ExpenseChart({ transactions }) {
  const incomeCategories = {};
  const expenseCategories = {};

  const [incomeChartInstance, setIncomeChartInstance] = useState(null);
  const [expenseChartInstance, setExpenseChartInstance] = useState(null);

  useEffect(() => {
    // When component unmounts, destroy the charts to free up the canvas
    return () => {
      if (incomeChartInstance) {
        incomeChartInstance.destroy();
      }
      if (expenseChartInstance) {
        expenseChartInstance.destroy();
      }
    };
  }, [incomeChartInstance, expenseChartInstance]);

  transactions.forEach((transaction) => {
    const category = transaction.category;
    const amount = transaction.amount;
    if (amount > 0) {
      if (!incomeCategories[category]) {
        incomeCategories[category] = amount;
      } else {
        incomeCategories[category] += amount;
      }
    } else {
      if (!expenseCategories[category]) {
        expenseCategories[category] = amount;
      } else {
        expenseCategories[category] += amount;
      }
    }
  });

  const incomeData = {
    labels: Object.keys(incomeCategories),
    datasets: [
      {
        data: Object.values(incomeCategories),
        backgroundColor: [
          "rgba(255, 0, 0)",
          "rgba(0, 0, 255)",
          "rgba(255, 255, 0)",
          "rgba(0, 100, 0)",
        ],
      },
    ],
  };

  const expenseData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          "rgba(255, 0, 0)",
          "rgba(0, 0, 255)",
          "rgba(255, 255, 0)",
          "rgba(0, 100, 0)",
        ],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom", // You can change this to 'top', 'right', or 'left' as you see fit
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            let label = data.labels[tooltipItem.index];
            let value =
              data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="chart-display">
      <Pie
        data={incomeData}
        options={chartOptions}
        ref={setIncomeChartInstance}
      />
      <Pie
        data={expenseData}
        options={chartOptions}
        ref={setExpenseChartInstance}
      />
    </div>
  );
}

export default ExpenseChart;
