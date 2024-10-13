import React, { useState, useEffect } from 'react';
import ChatModal from './ChatModal'; 

function Header({ selectedAccount, handleAccountChange }) {
  const [isChatVisible, setChatVisible] = useState(false);
  const [username, setUsername] = useState(''); 
  const API_URL = 'http://localhost:8000/api/v1/users/current-user';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsername(data.data.username); 
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); 

  return (
    <div className='bg-gray-900 text-white p-10'>
      <h1 className="text-4xl mb-2 font-bold">Welcome Back {username || 'User'}!</h1>
      <p className="text-lg mb-6 text-[#516778]">This is your financial overview report</p>

      <div className="flex gap-4">
        <select
          value={selectedAccount}
          onChange={handleAccountChange}
          className="p-3 bg-[#0B1739] text-white rounded-xl"
        >
          <option value="All accounts">All accounts</option>
          <option value="checking">Checking Account</option>
          <option value="savings">Saving Account</option>
        </select>
        
        <button 
          className="bg-[#0B1739] text-white py-2 px-4 rounded-xl"
          onClick={() => setChatVisible(true)}
        >
          Open Chat
        </button>
      </div>

      <ChatModal visible={isChatVisible} onClose={() => setChatVisible(false)} />
    </div>
  );
}

export default Header;
