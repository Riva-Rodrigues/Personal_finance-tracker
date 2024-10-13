import React, { useEffect, useState } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';  
import CountUp from 'react-countup'; 
import Nav from './Nav';
import Header from './Header';
import moment from 'moment'; 

const Overview = () => {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [categoriesData, setCategoriesData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Transactions',
        data: [],
        fill: false,
        backgroundColor: '#3D8DFF',
        borderColor: '#704FF7',
      },
    ],
  });

  const donutOptions = {
    maintainAspectRatio: false,
    responsive: true,
    cutout: '50%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountResponse = await fetch('http://localhost:8000/api/v1/accounts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
          },
        });
        const accounts = await accountResponse.json();

        const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
        setBalance(totalBalance);

        const transactionResponse = await fetch('http://localhost:8000/api/v1/trans', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
          },
        });
        const transactions = await transactionResponse.json();

        let totalIncome = 0;
        let totalExpenses = 0;
        const categoryExpenses = {};
        const monthlyData = Array(12).fill(0); 

        transactions.forEach((transaction) => {
          const month = moment(transaction.date).month(); 
          const amount = transaction.amount;

          if (transaction.type === 'income') {
            totalIncome += amount;
          } else if (transaction.type === 'expense') {
            totalExpenses += amount;

            if (!categoryExpenses[transaction.category]) {
              categoryExpenses[transaction.category] = 0;
            }
            categoryExpenses[transaction.category] += amount;
          }

          if (month >= 0 && month < 12) {
            monthlyData[month] += amount; 
          }
        });

        setIncome(totalIncome);
        setExpenses(totalExpenses);

        setCategoriesData({
          labels: Object.keys(categoryExpenses),
          datasets: [
            {
              data: Object.values(categoryExpenses),
              backgroundColor: ['#155EEF', '#9E77ED', '#0BA5EC', '#ECEFF2', '#4E5BA6'],
              hoverOffset: 4,
              borderWidth: 0,
            },
          ],
        });

        setLineData(prevData => ({
          ...prevData,
          labels: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          datasets: [
            {
              ...prevData.datasets[0],
              data: monthlyData, 
            },
          ],
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const overviewData = [
    { title: 'Balance', value: balance, change: '+12.5%', positive: true },
    { title: 'Incomes', value: income, change: '+27%', positive: true },
    { title: 'Expenses', value: expenses, change: '-15%', positive: false },
  ];

  return (
    <>
      <Nav />
      <Header />
      <div className="bg-gray-900 text-white min-h-screen px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {overviewData.map((item, index) => (
            <div key={index} className="bg-[#0B1739] p-6 rounded-lg shadow-lg flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-3xl font-bold mt-2">
                  <CountUp
                    start={0}
                    end={item.value}
                    duration={5}
                    separator=","
                    prefix="Rs. "
                    decimals={2}
                    decimal="."
                  />
                </p>
              </div>
              <span
                className={`text-sm self-end ${item.positive ? 'text-green-500' : 'text-red-500'}`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg sm:col-span-2">
            <h4 className="text-xl font-semibold mb-4">Transactions</h4>
            <Line data={lineData} />
          </div>

          <div className="bg-[#0B1739] p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-semibold mb-4">Categories</h4>
            <div className="relative h-64 w-64 mx-auto">
              {categoriesData.labels.length > 0 ? (
                <Doughnut data={categoriesData} options={donutOptions} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>
            <div className="mt-6">
              {categoriesData.labels &&
                categoriesData.labels.map((label, index) => {
                  const categoryValue = categoriesData.datasets[0].data[index];
                  const percentage = ((categoryValue / expenses) * 100).toFixed(2); 

                  return (
                    <div key={index} className="flex items-center justify-between mt-2">
                      <span className="text-white">{label}</span>
                      <span className="text-gray-400">
                        {percentage}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
