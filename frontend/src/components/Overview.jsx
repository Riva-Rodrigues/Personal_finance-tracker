import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2'; // Change Pie to Doughnut
import 'chart.js/auto';  // Importing Chart.js
import Nav from './Nav'
import Header from './Header'

const Overview = () => {
  // Dummy data for the Line chart
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Transactions',
        data: [0, 20000, 40000, 80000, 120000, 140000, 160000, 180000, 200000, 220000, 240000, 250000],
        fill: false,
        backgroundColor: '#3D8DFF',
        borderColor: '#704FF7',
      },
    ],
  };

  // Dummy data for the Donut chart
  const donutData = {
    labels: ['House', 'Credit Card', 'Transportation', 'Groceries', 'Shopping'],
    datasets: [
      {
        label: 'Categories',
        data: [41.35, 21.51, 13.47, 9.87, 3.35],
        backgroundColor: ['#155EEF', '#9E77ED', '#0BA5EC', '#ECEFF2', '#4E5BA6'],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  // Dummy data for overview cards
  const overviewData = [
    { title: 'Balance', value: '$5,502.45', change: '+12.5%', positive: true },
    { title: 'Incomes', value: '$9,450.00', change: '+27%', positive: true },
    { title: 'Expenses', value: '$3,945.55', change: '-15%', positive: false },
  ];

  // Options to make the donut chart smaller
  const donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: '50%', // This creates the hole for the donut effect
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
    <Nav />
    <Header/>
    <div className="bg-gray-900 text-white min-h-screen px-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {overviewData.map((item, index) => (
          <div key={index} className="bg-[#0B1739] p-6 rounded-lg shadow-lg flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-3xl font-bold mt-2">{item.value}</p>
            </div>
            <span
              className={`text-sm self-end ${
                item.positive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Line Chart for Transactions */}
        <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg sm:col-span-2">
          <h4 className="text-xl font-semibold mb-4">Transactions</h4>
          <Line data={lineData} />
        </div>

        {/* Donut Chart for Categories */}
        <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
          <h4 className="text-xl font-semibold mb-4">Categories</h4>
          <div className="relative h-64 w-64 mx-auto"> {/* Adjusted size */}
            <Doughnut data={donutData} options={donutOptions} /> {/* Changed to Doughnut */}
          </div>
          <div className="mt-6">
            {donutData.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between mt-2">
                <span className="text-white">{label}</span>
                <span className="text-gray-400">{donutData.datasets[0].data[index]}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Overview;
