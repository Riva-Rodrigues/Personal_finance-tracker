import React, { useState } from "react";
import { Table, Button, Modal, Input, Select } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Nav from './Nav';
import Header from './Header';

const { Option } = Select;

const Account = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // State for selected account type from the Header
  const [selectedAccount, setSelectedAccount] = useState('All accounts');

  // State variables for form inputs
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [branchName, setBranchName] = useState('');
  const [balance, setBalance] = useState('');

  // State to store the list of accounts
  const [accounts, setAccounts] = useState([
    {
      bankName: 'AB Bank Ltd.',
      accountType: 'Checking Account',
      branchName: 'Park Street Branch',
      accountNumber: '123 567 *** ***',
      balance: '$20,000',
    },
    {
      bankName: 'CD Bank Ltd.',
      accountType: 'Savings Account',
      branchName: 'Main Branch',
      accountNumber: '987 654 *** ***',
      balance: '$10,000',
    },
  ]);

  // Define the data structure for transactions (static for now)
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
      render: (amount) => (
        <span style={{ color: amount.startsWith("+") ? "#66DD9C" : "#FF5A5A" }}>{amount}</span>
      ),
    },
  ];

  // Handle account selection change in the Header
  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  // Show Modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle Modal Ok button
  const handleOk = () => {
    if (bankName && accountNumber && accountType && branchName && balance) {
      // Add new account to the accounts array
      const newAccount = {
        bankName,
        accountNumber,
        accountType,
        branchName,
        balance: `$${balance}`,
      };
      setAccounts([...accounts, newAccount]); // Append new account to existing accounts

      // Reset input fields after submission
      setBankName('');
      setAccountNumber('');
      setAccountType('');
      setBranchName('');
      setBalance('');
      setIsModalVisible(false); // Close modal after submission
    } else {
      alert("Please fill out all fields");
    }
  };

  // Handle Modal Cancel button
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Filter accounts based on selectedAccount
  const filteredAccounts = selectedAccount === 'All accounts'
    ? accounts
    : accounts.filter(account => account.accountType.toLowerCase() === selectedAccount.toLowerCase());

  return (
    <>
      <Nav />
      <Header selectedAccount={selectedAccount} handleAccountChange={handleAccountChange} />
      <div className="bg-gray-900 text-white min-h-screen px-10">
        {/* Account Details Section */}
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          <Button type="primary" icon={<PlusOutlined />} className='bg-[#155EEF]' onClick={showModal}>
            Add Account
          </Button>
        </div>

        {/* Display filtered accounts */}
        {filteredAccounts.map((account, index) => (
          <section key={index} className="bg-white p-8 rounded-lg shadow-lg mb-10 text-black">
            <div className="grid grid-cols-3 gap-x-8 gap-y-8">
              <div>
                <p className="text-[#516778]">Bank Name</p>
                <p className="text-xl font-bold">{account.bankName}</p>
              </div>
              <div>
                <p className="text-[#516778]">Account Type</p>
                <p className="text-xl font-bold">{account.accountType}</p>
              </div>
              <div>
                <p className="text-[#516778]">Branch Name</p>
                <p className="text-xl font-bold">{account.branchName}</p>
              </div>
              <div>
                <p className="text-[#516778]">Account Number</p>
                <p className="text-xl font-bold">{account.accountNumber}</p>
              </div>
              <div>
                <p className="text-[#516778]">Balance</p>
                <p className="text-xl font-bold">{account.balance}</p>
              </div>
            </div>
          </section>
        ))}

        {/* Transaction History Section */}
        <section className="bg-[#0B1739] py-4 rounded-md">
          <h2 className="text-2xl font-semibold mb-4 px-3">Transaction History</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg">
            <Table
              dataSource={transactionData}
              columns={columns}
              pagination={false}
              className="rounded-lg overflow-hidden"
            />
          </div>
        </section>

        {/* Modal for adding new account */}
        <Modal
          title="Add New Account"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Save"
          cancelText="Cancel"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Bank Name:</label>
            <Input
              placeholder="Enter bank name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Account Number:</label>
            <Input
              placeholder="Enter account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Account Type:</label>
            <Select
              placeholder="Select account type"
              value={accountType}
              onChange={(value) => setAccountType(value)}
              style={{ width: '100%' }}
            >
              <Option value="Savings Account">Savings Account</Option>
              <Option value="Checking Account">Checking Account</Option>
            </Select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Branch Name:</label>
            <Input
              placeholder="Enter branch name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500">Balance:</label>
            <Input
              type="number"
              placeholder="Enter balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
            />
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Account;