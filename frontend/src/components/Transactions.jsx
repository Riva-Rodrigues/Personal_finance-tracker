import React, { useState, useEffect } from "react";
import { Table, Modal, Input, Select, DatePicker, Button } from "antd";
import moment from "moment";
import Nav from './Nav';
import Header from './Header';
import { DownloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const columns = [
  { title: "Category", dataIndex: "category", key: "category" },
  { title: "Payee", dataIndex: "payee", key: "payee" },
  { 
    title: "Date", 
    dataIndex: "date", 
    key: "date",
    render: (text) => moment(text).format("YYYY-MM-DD"),
  },
  { 
    title: "Amount", 
    dataIndex: "amount", 
    key: "amount", 
    render: (text, record) => {
      const isExpense = record.type === "expense";
      return (
        <span style={{ color: isExpense ? "red" : "green" }}>
          {isExpense ? `- ${text}` : `+ ${text}`}
        </span>
      );
    }
  },
  { 
    title: "Account Name", 
    dataIndex: "accountId", 
    key: "accountId", 
    render: (text, record) => record.accountId?.accountName || 'N/A' 
  },
];

const Transactions = () => {
  const API_URL = "http://localhost:8000/api/v1/trans"; 
  const [transactionData, setTransactionData] = useState([]);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    accountName: "", 
    category: "", 
    payee: "", 
    date: "", 
    amount: "", 
    type: "expense", 
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
          }
        });
        const data = await response.json();
        const transactionsWithKey = data.map(transaction => ({
          ...transaction,
          key: transaction._id,
        }));
        setTransactionData(transactionsWithKey);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [API_URL]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async (event) => {
    event.preventDefault(); 

    const form = event.target;

    if (form.checkValidity()) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
          },
          body: JSON.stringify({
            accountName: newTransaction.accountName, 
            category: newTransaction.category,
            payee: newTransaction.payee,
            amount: parseFloat(newTransaction.amount), 
            date: newTransaction.date,
            type: newTransaction.type, 
          })
        });

        const createdTransaction = await response.json();
        if (response.ok) {
          setTransactionData([...transactionData, { ...createdTransaction, key: createdTransaction._id }]);
          setIsModalVisible(false);
          setNewTransaction({ accountName: "", category: "", payee: "", date: "", amount: "", type: "expense" });
        } else {
          console.error("Error creating transaction:", createdTransaction.message);
        }
      } catch (error) {
        console.error("Error creating transaction:", error);
      }
    } else {
      form.reportValidity(); 
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

  const downloadCSV = () => {
    const headers = columns.map(column => column.title);
    
    const csvContent = [
      headers.join(','), 
      ...transactionData.map(row => 
        columns.map(column => {
          if (column.dataIndex === 'date') {
            return moment(row[column.dataIndex]).format("YYYY-MM-DD"); 
          }
          if (column.dataIndex === 'accountId') {
            return row.accountId?.accountName || 'N/A'; 
          }
          return row[column.dataIndex] || ''; 
        }).join(',')
      )
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'transactions.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Nav />
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-10 pb-5">
        <div className="flex justify-between">
          <button 
            className="bg-[#0B1739] text-white py-3 px-6 rounded-xl" 
            onClick={showModal}
          >
            Add transaction
          </button>
          <button 
            className="bg-[#0B1739] text-white py-3 px-6 rounded-xl flex items-center"
            onClick={downloadCSV}
          >
            <DownloadOutlined className="mr-2" /> Download CSV
          </button>
        </div>

        <div className="bg-[#0B1739] mt-10 rounded-lg">
          <h4 className="text-2xl font-semibold py-4 pl-4">Transaction History</h4>
          <Table 
            dataSource={transactionData} 
            columns={columns} 
            pagination={false} 
            className="bg-[#1A1E32] text-white overflow-hidden rounded-lg"
          />
        </div>

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
                <Option value="housing">Housing</Option>
                <Option value="utilities">Utilities</Option>
                <Option value="groceries">Groceries</Option>
                <Option value="transportation">Transportation</Option>
                <Option value="healthcare">Healthcare</Option>
                <Option value="savings">Savings</Option>
                <Option value="entertainment">Entertainment</Option>
                <Option value="shopping">Shopping</Option>
                <Option value="education">Education</Option>
                <Option value="miscellaneous">Miscellaneous</Option>
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
              <label className="block text-sm font-medium text-gray-500">Account Name</label>
              <Input
                placeholder="Account Name"
                value={newTransaction.accountName}
                onChange={(e) => handleInputChange("accountName", e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Transaction Type</label>
              <Select
                placeholder="Select Type"
                onChange={(value) => handleInputChange("type", value)}
                value={newTransaction.type}
                className="w-full"
                required
              >
                <Option value="expense">Expense</Option>
                <Option value="income">Income</Option>
              </Select>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Transactions;
