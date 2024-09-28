import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Nav from './Nav'
import Header from './Header'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Goals = () => {
  const doughnutData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [63, 37], // 63% achieved, 37% remaining
        backgroundColor: ['#CB3CFF', '#0038FF'], // Blue for achieved, gray for remaining
        hoverOffset: 4,
        borderWidth: 0, // Remove the border
      },
    ],
  };

  // Options to make the doughnut chart a semi-circle
  const doughnutOptions = {
    rotation: -90, // Start the chart from the top
    circumference: 180, // Only show half the doughnut (semi-circle)
    cutout: '90%', // Create the thickness of the doughnut
    plugins: {
      legend: {
        display: false, // Hide legend
      },
    },
  };

  // Dummy data for the chart
  const data = {
    labels: ["July 01", "July 05", "July 10", "July 15", "July 20", "July 25"],
    datasets: [
      {
        label: "Savings",
        data: [1000, 5000, 7000, 10000, 15000, 12500],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Savings Summary",
      },
    },
  };

  return (
    <>
    <Nav />
    <Header />
    <div className="bg-gray-900 text-white min-h-screen px-10 pb-5">
      {/* Goals Section */}
      <section className="grid md:grid-cols-2 gap-10 mb-10">
      
        {/* Savings Goal */}
        <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Saving Goal</h2>
        <div className="flex justify-between items-center">
        <div className="flex-1">
            <p className="text-gray-400">Target Achieved</p>
            <h3 className="text-3xl font-bold">$12,500</h3>
            <p className="text-gray-400 mt-10">This Month Target</p>
            <h3 className="text-3xl font-bold">$20,000</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-56 h-56">
              <Doughnut data={doughnutData} options={doughnutOptions}/>
            </div>
            <p className="text-gray-400">63% Target vs Achievement</p>
          </div>
        </div>
        <div className="px-auto">
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Adjust Target</button>
        </div>
        </div>

        {/* Savings Summary Chart */}
        <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Saving Summary</h2>
          <Line data={data} options={options} />
        </div>
      </section>

      {/* Expenses Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Expenses Goals by Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ExpenseCategory name="Housing" amount="$250.00" />
          <ExpenseCategory name="Shopping" amount="$450.00" />
          <ExpenseCategory name="Food" amount="$300.00" />
          <ExpenseCategory name="Transportation" amount="$200.00" />
          <ExpenseCategory name="Entertainment" amount="$150.00" />
          <ExpenseCategory name="Others" amount="$100.00" />
        </div>
      </section>
    </div>
    </>
  );
};

// ExpenseCategory Component
const ExpenseCategory = ({ name, amount }) => {
  return (
    <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold mt-2">{amount}</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Adjust</button>
      </div>
    </div>
  );
};

export default Goals;
