import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Avatar } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import logo from '../assets/logo.png'

function Nav() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'overview';
  const [initials, setInitials] = useState('');

  const navItems = [
    { key: 'overview', label: 'Overview', to: '/overview' },
    { key: 'transactions', label: 'Transactions', to: '/transactions' },
    { key: 'goals', label: 'Goals', to: '/goals' },
    { key: 'accounts', label: 'Accounts', to: '/accounts' },
    { key: 'bills', label: 'Bills', to: '/bills' },
    { key: 'predictions', label: 'Predictions', to: '/predictions' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/current-user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        const user = response.data;
        console.log(user);
        // Extract initials from the user's name (assuming full name is available)
        const userInitials = getInitials(user.data.username);
        setInitials(userInitials);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  const getInitials = (name) => {
    if (!name) return '';
    return name
      .replace(/\s+/g, '') 
      .substring(0, 2)     
      .toUpperCase();    
  };

  return (
    <header className="flex justify-between items-center bg-[#101828] py-4 px-10 text-white">
      <div className="flex items-center space-x-3 text-2xl font-bold">
        <img src={logo} alt="Financy Logo" className="h-8 w-16" />
        <span>financy</span>
    </div>


      <div className="flex-grow">
        <nav className="flex items-center justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={`${
                currentPath === item.key ? 'font-bold bg-[#0B1739] p-2 rounded-md text-[#155EEF]' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Avatar className="bg-[#155EEF]">{initials || 'U'}</Avatar>
      </div>
    </header>
  );
}

export default Nav;
