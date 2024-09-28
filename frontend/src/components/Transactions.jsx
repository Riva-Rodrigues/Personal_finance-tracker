import React, { useState } from "react";
import { Table, Modal, Input, Select, DatePicker, Button } from "antd";
import moment from "moment";
import Nav from './Nav'
import Header from './Header'

const { Option } = Select;

const columns = [
  { title: "Category", dataIndex: "category", key: "category" },
  { title: "Payee", dataIndex: "payee", key: "payee" },
  { title: "Date", dataIndex: "date", key: "date" },
  { 
    title: "Amount", 
    dataIndex: "amount", 
    key: "amount",
    render: (amount) => (
      <span className={amount.startsWith('+') ? "text-[#66DD9C]" : "text-[#FF5A5A]"}>{amount}</span>
    )
  },
  { title: "Account", dataIndex: "account", key: "account" },
];

const Transactions = () => {
  const [transactionData, setTransactionData] = useState([
    { key: "1", category: "Food and Drink, Restaurant", payee: "Tectra Inc", date: "2024/04/01", amount: "+$750.00", account: "Plaid Credit Card" },
    { key: "2", category: "Clothing", payee: "Merchant", date: "2024/04/01", amount: "-$250.00", account: "Checking" },
    { key: "3", category: "Food", payee: "Merchant", date: "2024/04/01", amount: "+$750.00", account: "Checking" },
    { key: "4", category: "Utilities", payee: "Tectra Inc", date: "2024/04/01", amount: "+$850.00", account: "Plaid Credit Card" },
  ]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    key: "", category: "", payee: "", date: "", amount: "", account: ""
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const form = event.target;

    if (form.checkValidity()) {
      const key = (transactionData.length + 1).toString();
      const updatedData = [...transactionData, { ...newTransaction, key }];
      setTransactionData(updatedData);
      setIsModalVisible(false);
      setNewTransaction({ key: "", category: "", payee: "", date: "", amount: "", account: "" });
    } else {
      form.reportValidity(); // Native browser validation feedback
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleInputChange = (field, value) => {
    setNewTransaction({ ...newTransaction, [field]: value });
  };

  const handleDateChange = (date, dateString) => {
    handleInputChange("date", dateString);
  };

  return (
    <>
    <Nav />
    <Header />
    <div className="min-h-screen bg-gray-900 text-white px-10">
      
      {/* Filter and Add Button */}
      <div>
        <button 
          className="bg-[#0B1739] text-white py-3 px-6 rounded-xl" 
          onClick={showModal}
        >
          Add transaction
        </button>
      </div>

      {/* Transaction History Table */}
      <div className="bg-[#0B1739] mt-10 rounded-lg">
        <h4 className="text-2xl font-semibold py-4 pl-4">Transaction History</h4>
        <Table 
          dataSource={transactionData} 
          columns={columns} 
          pagination={false} 
          className="bg-[#1A1E32] text-white overflow-hidden rounded-lg"
        />
      </div>

      {/* Modal for adding a transaction */}
      <Modal
        title="Add Transaction"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button 
            form="transaction-form"
            key="submit" 
            type="primary" 
            htmlType="submit"
          >
            Add
          </Button>
        ]}
      >
        <form id="transaction-form" onSubmit={handleOk} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Payee</label>
            <Input 
              placeholder="Payee" 
              value={newTransaction.payee} 
              onChange={(e) => handleInputChange("payee", e.target.value)} 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Category</label>
            <Select
              placeholder="Select Category"
              onChange={(value) => handleInputChange("category", value)}
              value={newTransaction.category}
              className="w-full"
              required
            >
              <Option value="Food">Food</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Utilities">Utilities</Option>
              <Option value="Travel">Travel</Option>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Date</label>
            <DatePicker
              placeholder="Select Date"
              onChange={handleDateChange}
              value={newTransaction.date ? moment(newTransaction.date) : undefined}
              className="w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Amount</label>
            <Input 
              placeholder="Amount" 
              value={newTransaction.amount} 
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500">Account</label>
            <Select
              placeholder="Select Account"
              onChange={(value) => handleInputChange("account", value)}
              value={newTransaction.account}
              className="w-full"
              required
            >
              <Option value="Checking">Checking</Option>
              <Option value="Credit Card">Credit Card</Option>
            </Select>
          </div>
        </form>
      </Modal>
    </div>
    </>
  );
};

export default Transactions;
