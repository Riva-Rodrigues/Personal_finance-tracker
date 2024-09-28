import React from "react";
import { Table } from "antd";
import Nav from './Nav'
import Header from './Header'

const AccountPage = () => {
  // Define the data structure for transactions
  const transactionData = [
    { key: "1", category: "Food and Drink, Restaurant", payee: "Tectra Inc", date: "2024/04/01", amount: "+$750.00" },
    { key: "2", category: "Clothing", payee: "Merchant", date: "2024/04/01", amount: "-$250.00" },
    { key: "3", category: "Food", payee: "Merchant", date: "2024/04/01", amount: "+$750.00" },
    { key: "4", category: "Utilities", payee: "Merchant", date: "2024/04/01", amount: "+$850.00" },
    { key: "5", category: "Clothing", payee: "Merchant", date: "2024/04/01", amount: "-$250.00" },
  ];

  // Define columns for the Ant Design table
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Payee",
      dataIndex: "payee",
      key: "payee",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <span style={{ color: amount.startsWith("+") ? "#66DD9C" : "#FF5A5A" }}>{amount}</span>
      ),
    },
  ];

  return (
    <>
    <Nav />
    <Header />
    <div className="bg-gray-900 text-white min-h-screen px-10">
      {/* Account Details Section */}
      <h2 className="text-2xl font-semibold mb-4">Account Details</h2>

      <section className="bg-white p-8 rounded-lg shadow-lg mb-10 text-black">
        <div className="grid grid-cols-3 gap-x-8 gap-y-8">
          <div>
            <p className="text-[#516778]">Bank Name</p>
            <p className="text-xl font-bold">AB Bank Ltd.</p>
          </div>
          <div>
            <p className="text-[#516778]">Account Type</p>
            <p className="text-xl font-bold">Checking</p>
          </div>
          <div>
            <p className="text-[#516778]">Branch Name</p>
            <p className="text-xl font-bold">Park Street Branch</p>
          </div>
          <div>
            <p className="text-[#516778]">Account Number</p>
            <p className="text-xl font-bold">123 567 *** ***</p>
          </div>
          <div>
            <p className="text-[#516778]">Balance</p>
            <p className="text-xl font-bold">$20,000</p>
          </div>
        </div>

        <div className="flex space-x-4 mt-6">
          <button className="bg-gray-900 px-4 py-2 rounded-xl text-white">Save Changes</button>
          <button className="bg-[#ECEFF2] px-4 py-2 rounded-xl">Remove</button>
        </div>
      </section>

      {/* Transaction History Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg">
          {/* Ant Design Table */}
          <Table
            dataSource={transactionData}
            columns={columns}
            pagination={false}
            className="rounded-lg overflow-hidden"
          />
        </div>
      </section>
    </div>
    </>
  );
};

export default AccountPage;
