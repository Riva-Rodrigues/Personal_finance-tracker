import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { PolynomialRegression } from 'ml-regression';
import Nav from './Nav';
import Header from './Header';

const Prediction = () => {
  const expenses = [900, 850, 950, 700, 800, 750, 850, 900, 950, 1000, 1100, 1050];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const [chartData, setChartData] = useState(null);

  const handlePredict = () => {
    const x = expenses.map((_, index) => index + 1); 
    const y = expenses; 

    const degree = 1; 
    const regression = new PolynomialRegression(x, y, degree);

    const predictedExpenses = [];
    for (let i = 1; i <= 12; i++) {
      const nextMonth = expenses.length + i;
      const futureExpense = regression.predict(nextMonth);
      predictedExpenses.push(futureExpense.toFixed(2));
    }

    setChartData({
      labels: months, 
      datasets: [
        {
          label: 'Actual Expenses',
          data: expenses, 
          fill: false,
          borderColor: '#7e57c2',
          backgroundColor: '#7e57c2',
          pointBackgroundColor: '#7e57c2',
          pointBorderColor: '#7e57c2',
          pointRadius: 5,
        },
        {
          label: 'Predicted Expenses',
          data: predictedExpenses, 
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgb(75, 192, 192)',
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: 'rgb(75, 192, 192)',
          pointRadius: 5,
          borderDash: [10, 5],
        },
      ],
    });
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#444',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#444',
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <>
      <Nav />
      <Header />
      <div className="bg-gray-900 text-white min-h-screen px-10 pb-8">
        <button
          className="mb-8 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={handlePredict}
        >
          Show Predicted Expenses for Next Year
        </button>

        {chartData && (
          <div className="bg-[#0B1739] p-6 rounded-lg h-[100%]">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        
      </div>
    </>
  );
};

export default Prediction;