import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, message } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import Nav from './Nav';
import Header from './Header';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const Account = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('All accounts');

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [branchName, setBranchName] = useState('');
  const [balance, setBalance] = useState('');

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/accounts', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error('Unauthorized access. Please log in.');
        } else {
          message.error('Failed to fetch accounts. Please try again later.');
        }
        console.error(error);
      }
    };

    fetchAccounts();
  }, []);

  const fetchTransactions = async (accountType) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/trans/type/${accountType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        message.error('Unauthorized access. Please log in.');
      } else {
        message.error('Failed to fetch transactions. Please try again later.');
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedAccount !== 'All accounts') {
      fetchTransactions(selectedAccount.toLowerCase());
    } else {
      setTransactions([]);
    }
  }, [selectedAccount]);

  const transactionColumns = [
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
      render: (date) => moment(date).format('YYYY-MM-DD'), 
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount, record) => (
        <span style={{ color: record.type === "expense" ? "#FF5A5A" : "#66DD9C" }}>
          {record.type === "income" ? `+${amount}` : `-${amount}`}
        </span>
      ),
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
    },
  ];

  const handleAccountChange = (event) => {
    setSelectedAccount(event.target.value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    if (bankName && accountNumber && accountType && branchName && balance && accountName) {
      try {
        const newAccount = {
          bankName,
          accountNumber,
          accountName,
          accountType,
          branchName,
          balance: parseFloat(balance),
        };

        const response = await axios.post('http://localhost:8000/api/v1/accounts', newAccount, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        });

        setAccounts([...accounts, response.data]);

        setBankName('');
        setAccountNumber('');
        setAccountName('');
        setAccountType('');
        setBranchName('');
        setBalance('');
        setIsModalVisible(false);

        message.success('Account created successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          message.error('Unauthorized access. Please log in.');
        } else {
          message.error('Failed to create account. Please try again.');
        }
        console.error(error);
      }
    } else {
      message.error("Please fill out all fields");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const filteredAccounts = selectedAccount === 'All accounts'
    ? accounts
    : accounts.filter(account => account.accountType.toLowerCase() === selectedAccount.toLowerCase());

  return (
    <>
      <Nav />
      <Header selectedAccount={selectedAccount} handleAccountChange={handleAccountChange} />
      <div className="bg-gray-900 text-white min-h-screen px-10 pb-1">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
          <Button type="primary" icon={<PlusOutlined />} className='bg-[#155EEF]' onClick={showModal}>
            Add Account
          </Button>
        </div>

        {filteredAccounts.map((account) => (
          <section key={account.id} className="bg-white p-8 rounded-lg shadow-lg mb-10 text-black">
            <div className="grid grid-cols-3 gap-x-8 gap-y-8">
              <div>
                <p className="text-[#516778]">Bank Name</p>
                <p className="text-xl font-bold">{account.bankName}</p>
              </div>
              <div>
                <p className="text-[#516778]">Account Name</p>
                <p className="text-xl font-bold">{account.accountName}</p>
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
                <p className="text-xl font-bold"> Rs. {account.balance}</p>
              </div>
            </div>
          </section>
        ))}

        {selectedAccount !== 'All accounts' && (
          <section className="bg-[#0B1739] py-4 rounded-md">
            <h2 className="text-2xl font-semibold mb-4 px-3">Transaction History</h2>
            <div className="bg-gray-800 rounded-lg shadow-lg">
            <Table
                dataSource={transactions}
                columns={transactionColumns}
                pagination={false}
                className="rounded-lg overflow-hidden"
            />
            </div>
          </section>
        )}

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
            <label className="block text-sm font-medium text-gray-500">Account Name:</label>
            <Input
              placeholder="Enter account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
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
            >
              <Option value="saving">Saving</Option>
              <Option value="current">Current</Option>
              <Option value="fixed">Fixed</Option>
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
