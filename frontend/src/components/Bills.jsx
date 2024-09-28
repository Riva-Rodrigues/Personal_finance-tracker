import React, { useState } from 'react';
import { Table, Button, Modal, Input, DatePicker } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Reset Ant Design default styles
import moment from 'moment';
import Nav from './Nav'
import Header from './Header'

const Bills = () => {
  // Initial dummy data for the upcoming bills
  const initialBills = [
    {
      dueDate: '2024/07/15',
      item: 'Figma-Yearly Subscription',
      description: 'For advanced security and flexible controls.',
      lastCharge: '2024/07/14',
      amount: '$150',
    },
    {
      dueDate: '2024/07/30',
      item: 'Adobe',
      description: 'Professional plan for scaling design processes.',
      lastCharge: '2024/07/28',
      amount: '$200',
    },
    {
      dueDate: '2024/08/10',
      item: 'Electricity',
      description: 'Monthly electricity bill.',
      lastCharge: '2024/07/10',
      amount: '$200',
    },
  ];

  // State to manage the modal visibility, form values, and bills data
  const [bills, setBills] = useState(initialBills);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBill, setNewBill] = useState({
    dueDate: '',
    item: '',
    description: '',
    lastCharge: '',
    amount: '',
  });

  // Function to handle showing the modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  // Function to handle date changes
  const handleDateChange = (date, dateString, fieldName) => {
    setNewBill({ ...newBill, [fieldName]: dateString });
  };

  // Function to handle form submission (adding a new bill)
  const handleAddBill = (e) => {
    e.preventDefault(); // Prevent form submission
    setBills([...bills, { ...newBill, key: bills.length }]); // Add new bill to the existing list
    setIsModalVisible(false); // Close the modal
    setNewBill({ dueDate: '', item: '', description: '', lastCharge: '', amount: '' }); // Reset form
  };

  // Modal cancel handler
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Columns for the bills table
  const columns = [
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (dueDate) => (
        <div className="bg-[#516778] text-white text-center rounded-md p-2 w-20">
          <p className="text-lg font-bold">{moment(dueDate).format('MMM')}</p>
          <p className="text-sm">{moment(dueDate).format('DD')}</p>
        </div>
      ),
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'Item Description',
      dataIndex: 'description',
      key: 'description',
      render: (description) => <span className="text-gray-400">{description}</span>,
    },
    {
      title: 'Last Charge',
      dataIndex: 'lastCharge',
      key: 'lastCharge',
      render: (lastCharge) => <span className="text-gray-400">{lastCharge}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span className="font-bold">{amount}</span>,
    },
    {
      title: '',
      key: 'action',
      render: () => (
        <Button type="text" shape="circle" icon={<MoreOutlined />} />
      ),
    },
  ];

  return (
    <>
    <Nav />
    <Header />
    <div className="min-h-screen bg-gray-900 text-white px-10">
      {/* Upcoming Bills */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Upcoming Bills</h2>
          {/* Add Bill Button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Add Bill
          </Button>
        </div>
        <div className="rounded-lg overflow-hidden">
          <Table
            columns={columns}
            dataSource={bills}
            pagination={false}
            rowClassName="border-b border-gray-600"
          />
        </div>
      </section>

      {/* Add Bill Modal */}
      <Modal
        title="Add a New Bill"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleAddBill} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Due Date</label>
            <DatePicker
              className="w-full"
              format="YYYY/MM/DD"
              onChange={(date, dateString) => handleDateChange(date, dateString, 'dueDate')}
              value={newBill.dueDate ? moment(newBill.dueDate) : null}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Item</label>
            <Input
              type="text"
              name="item"
              placeholder="E.g. Adobe"
              value={newBill.item}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Description</label>
            <Input
              type="text"
              name="description"
              placeholder="E.g. Description of the bill"
              value={newBill.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Charge</label>
            <DatePicker
              className="w-full"
              format="YYYY/MM/DD"
              onChange={(date, dateString) => handleDateChange(date, dateString, 'lastCharge')}
              value={newBill.lastCharge ? moment(newBill.lastCharge) : null}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Amount</label>
            <Input
              type="text"
              name="amount"
              placeholder="E.g. $200"
              value={newBill.amount}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Add Bill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
    </>
  );
};

export default Bills;
