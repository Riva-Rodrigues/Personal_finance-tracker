import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Nav from './Nav'
import Header from './Header'

const FinancialOverview = () => {


  // const chartData = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
  //   datasets: [
  //     {
  //       label: 'Actual Expense',
  //       data: [15000, 20000, 18000, 22000, 25000, 27000, 30000, 28000, 32000],
  //       fill: false,
  //       borderColor: '#7e57c2',
  //       backgroundColor: '#7e57c2',
  //       pointBackgroundColor: '#7e57c2',
  //       pointBorderColor: '#7e57c2',
  //       pointRadius: 5,
  //     },
  //     {
  //       label: 'Predicted Expense',
  //       data: [16000, 21000, 19500, 23000, 26000, 28000, 31000, 29500, 33500],
  //       fill: false,
  //       borderColor: '#ffca28',
  //       backgroundColor: '#ffca28',
  //       pointBackgroundColor: '#ffca28',
  //       pointBorderColor: '#ffca28',
  //       pointRadius: 5,
  //       borderDash: [10, 5],
  //     },
  //     {
  //       label: 'Regression Line',
  //       data: [15000, 19000, 21000, 24000, 27000, 30000, 32000, 35000, 37000],
  //       fill: false,
  //       borderColor: '#fff',
  //       borderWidth: 2,
  //       pointRadius: 0, // No points on the regression line
  //     },
  //   ],
  // };

  // const chartOptions = {
  //   scales: {
  //     y: {
  //       beginAtZero: false,
  //       ticks: {
  //         color: '#ffffff',
  //       },
  //       grid: {
  //         color: '#444',
  //       },
  //     },
  //     x: {
  //       ticks: {
  //         color: '#ffffff',
  //       },
  //       grid: {
  //         color: '#444',
  //       },
  //     },
  //   },
  //   plugins: {
  //     legend: {
  //       labels: {
  //         color: '#ffffff',
  //       },
  //     },
  //   },
  // };

  return (
    <>
    <Nav />
    <Header />
    <div className=" bg-gray-900 text-white min-h-screen px-10 pb-8">
        <button className="mb-8 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
        Show Predicted Expenses for Next Year
      </button>
      <div className="bg-[#0B1739] p-6 rounded-lg h-[100%]">
        {/* <Line data={chartData} options={chartOptions} /> */}
      </div>

    
    </div>
    </>
  );
};

export default FinancialOverview;
