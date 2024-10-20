import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, DatePicker, message, notification } from 'antd';
import { PlusOutlined, MoreOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import moment from 'moment';
import axios from 'axios';
import Nav from './Nav';
import Header from './Header';

const Bills = () => {
  const [bills, setBills] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBill, setNewBill] = useState({
    dueDate: '',
    item: '',
    itemDescription: '',
    lastCharge: '',
    amount: '',
  });

  useEffect(() => {
    fetchBills();
    scheduleDueBillsDeletion();
    // const checkInterval = setInterval(() => {
    //   checkBillsDue();
    // }, 1000 * 60 * 60); // Check every hour

    // return () => clearInterval(checkInterval);
    return () => {
      const timeoutId = window.localStorage.getItem('deletionTimeoutId');
      if (timeoutId) {
        clearTimeout(parseInt(timeoutId));
      }
    };
  }, []);
  

  const scheduleDueBillsDeletion = () => {
    const now = moment();
    const tonight = moment().endOf('day');
    const msUntilMidnight = tonight.diff(now);

    const timeoutId = setTimeout(() => {
      deleteExpiredBills();
      scheduleDueBillsDeletion();
    }, msUntilMidnight);

    window.localStorage.setItem('deletionTimeoutId', timeoutId.toString());
  };


  const deleteExpiredBills = async () => {
    const today = moment().startOf('day');
    
    const expiredBills = bills.filter(bill => 
      moment(bill.dueDate).isSame(today, 'day')
    );

    for (const bill of expiredBills) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/bills/${bill._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        notification.info({
          message: 'Bill Deleted',
          description: `${bill.item} (Rs. ${bill.amount}) has been automatically deleted as it was due today.`,
        });
      } catch (error) {
        console.error('Error deleting expired bill:', error);
        notification.error({
          message: 'Error',
          description: `Failed to delete expired bill: ${bill.item}`,
        });
      }
    }
    fetchBills();
  };

  
  const fetchBills = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/bills', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setBills(response.data);
      checkBillsDue(response.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      message.error('Failed to fetch bills.');
    }
  };

  const checkBillsDue = (billsToCheck = bills) => {
    const today = moment();
    const tomorrow = today.clone().add(1, 'days');
    const twoDaysFromNow = today.clone().add(2, 'days');

    billsToCheck.forEach((bill) => {
      const dueDate = moment(bill.dueDate);

      if (dueDate.isSame(today, 'day')) {
        sendNotification(bill, 'due today');
      } 
      else if (dueDate.isSame(tomorrow, 'day')) {
        sendNotification(bill, 'due tomorrow');
      } 
      else if (dueDate.isSame(twoDaysFromNow, 'day')) {
        sendNotification(bill, 'due in 2 days');
      }
    });
  };

  const sendNotification = (bill, timeframe) => {
    // Use Ant Design's notification system
    notification.open({
      message: `Bill ${timeframe}`,
      description: `${bill.item} - Rs. ${bill.amount} is ${timeframe}!`,
      onClick: () => {
        console.log('Notification Clicked!');
      },
      style: {
        cursor: 'pointer',
      },
    });

    // Also show a message warning in the application
    // message.warning(`${bill.item} - Rs. ${bill.amount} is ${timeframe}!`);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBill({ ...newBill, [name]: value });
  };

  const handleDateChange = (date, dateString, fieldName) => {
    setNewBill({ ...newBill, [fieldName]: dateString });
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/v1/bills', { ...newBill }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      setBills([...bills, response.data]); // Add new bill to the state
      setIsModalVisible(false);
      setNewBill({ dueDate: '', item: '', itemDescription: '', lastCharge: '', amount: '' });
    } catch (error) {
      console.error('Error adding bill:', error);
      message.error('Failed to add bill. Check your input data and try again.');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const deleteBill = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/bills/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setBills(bills.filter((bill) => bill._id !== id));
      message.success('Bill deleted successfully.');
    } catch (error) {
      console.error('Error deleting bill:', error);
      message.error('Failed to delete bill.');
    }
  };

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
      dataIndex: 'itemDescription',
      key: 'itemDescription',
      render: (itemDescription) => <span className="text-gray-400">{itemDescription}</span>,
    },
    {
      title: 'Last Charge',
      dataIndex: 'lastCharge',
      key: 'lastCharge',
      render: (lastCharge) => <span className="text-gray-400">{moment(lastCharge).format('YYYY-MM-DD')}</span>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <span className="font-bold">Rs. {amount}</span>,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Button type="text" shape="circle" icon={<MoreOutlined />} onClick={() => deleteBill(record._id)} />
      ),
    },
  ];

  return (
    <>
      <Nav />
      <Header />
      <div className="min-h-screen bg-gray-900 text-white px-10">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Upcoming Bills</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal} className='bg-[#155EEF]'>
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
                name="itemDescription"
                placeholder="E.g. Description of the bill"
                value={newBill.itemDescription}
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
                type="number"
                name="amount"
                placeholder="E.g. Rs.200"
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
