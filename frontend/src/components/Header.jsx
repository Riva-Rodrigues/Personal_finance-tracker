import React, { useState } from 'react';
import ChatModal from './ChatModal'; // Import the ChatModal

function Header({ selectedAccount, handleAccountChange }) {
  const [isChatVisible, setChatVisible] = useState(false);

  return (
    <div className='bg-gray-900 text-white p-10'>
      <h1 className="text-4xl mb-2 font-bold">Welcome Back Riva!</h1>
      <p className="text-lg mb-6 text-[#516778]">This is your financial overview report</p>

      <div className="flex gap-4">
        <select
          value={selectedAccount}
          onChange={handleAccountChange}
          className="p-3 bg-[#0B1739] text-white rounded-xl"
        >
          <option value="All accounts">All accounts</option>
          <option value="Savings Account">Savings Account</option>
          <option value="Checking Account">Checking Account</option>
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
