import React, { useState, useEffect } from "react";
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
import axios from 'axios';
import Nav from './Nav';
import Header from './Header';

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
  const [thisMonthTarget, setThisMonthTarget] = useState(20000);
  const [targetAchieved, setTargetAchieved] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(thisMonthTarget);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/accounts", {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          }
        });
        const savingsAccount = response.data.find(account => account.accountType === "savings");
        if (savingsAccount) {
          setTargetAchieved(savingsAccount.balance);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    };

    fetchBalance();
  }, []);

  const achievedPercentage = Math.min((targetAchieved / thisMonthTarget) * 100, 100);
  const remainingPercentage = 100 - achievedPercentage;

  const doughnutData = {
    labels: ['Achieved', 'Remaining'],
    datasets: [
      {
        data: [achievedPercentage, remainingPercentage],
        backgroundColor: ['#CB3CFF', '#0038FF'],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    rotation: -90,
    circumference: 180,
    cutout: '90%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const data = {
    labels: ["July 01", "July 05", "July 10", "July 15", "July 20", "July 25"],
    datasets: [
      {
        label: "Savings",
        data: [1000, 5000, 7000, 10000, 15000, targetAchieved],
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

  const handleAdjustClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveTarget = () => {
    setThisMonthTarget(newTarget);
    setIsModalOpen(false);
  };

  return (
    <>
      <Nav />
      <Header />
      <div className="bg-gray-900 text-white min-h-screen px-10 pb-5">
        <section className="grid md:grid-cols-2 gap-10 mb-10">
          <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Saving Goal</h2>
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className="text-gray-400">Target Achieved</p>
                <h3 className="text-3xl font-bold">Rs. {targetAchieved.toLocaleString()}</h3>
                <p className="text-gray-400 mt-10">This Month Target</p>
                <h3 className="text-3xl font-bold">Rs. {thisMonthTarget.toLocaleString()}</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-56 h-56">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <p className="text-gray-400">{achievedPercentage.toFixed(2)}% Target vs Achievement</p>
              </div>
            </div>
            <div className="px-auto">
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                onClick={handleAdjustClick}
              >
                Adjust Target
              </button>
            </div>
          </div>

          <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Saving Summary</h2>
            <Line data={data} options={options} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Expenses Goals by Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExpenseCategory name="Housing" amount="Rs. 250.00" />
            <ExpenseCategory name="Shopping" amount="Rs. 450.00" />
            <ExpenseCategory name="Food" amount="Rs. 300.00" />
            <ExpenseCategory name="Transportation" amount="Rs. 200.00" />
            <ExpenseCategory name="Entertainment" amount="Rs. 150.00" />
            <ExpenseCategory name="Others" amount="Rs.100.00" />
          </div>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Adjust Target</h3>
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(parseInt(e.target.value))}
                className="w-full p-2 mb-4 border rounded text-black"
                placeholder="Enter new target"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTarget}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

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
