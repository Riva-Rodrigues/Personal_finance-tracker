import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Avatar } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import logo from '../assets/logo.png'
function Nav() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'overview';

  const navItems = [
    { key: 'overview', label: 'Overview', to: '/overview' },
    { key: 'transactions', label: 'Transactions', to: '/transactions' },
    { key: 'goals', label: 'Goals', to: '/goals' },
    { key: 'accounts', label: 'Accounts', to: '/accounts' },
    { key: 'bills', label: 'Bills', to: '/bills' },
    { key: 'predictions', label: 'Predictions', to: '/predictions' },
  ];

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
        <Button shape="circle" icon={<SettingOutlined />} className="bg-gray-700 text-white" />
        <Avatar className="bg-gray-700" />
      </div>
    </header>
  );
}

export default Nav;
