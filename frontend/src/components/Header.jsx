import React, { useState } from 'react'

function Header() {
    const [selectedAccount, setSelectedAccount] = useState('All accounts');
    const [selectedDate, setSelectedDate] = useState('July 2024 - August 2024');
  
    const handleAccountChange = (event) => {
      setSelectedAccount(event.target.value);
    };
  
    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };
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

        <select
          value={selectedDate}
          onChange={handleDateChange}
          className="p-3 bg-[#0B1739] text-white rounded-xl"
        >
          <option value="July 2024 - August 2024">July 2024 - August 2024</option>
          <option value="May 2024 - June 2024">May 2024 - June 2024</option>
          <option value="January 2024 - February 2024">January 2024 - February 2024</option>
        </select>
      </div>
    </div>
  )
}

export default Header