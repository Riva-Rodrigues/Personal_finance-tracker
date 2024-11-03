import React from 'react';
import Nav from './Nav';
import Header from './Header';

const Stocks = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Nav />
      <Header />
      <div className="flex-grow">
        <iframe
          src="http://localhost:8501"
          width="100%"
          height="100%"
          style={{ border: 'none', minHeight: 'calc(100vh - 150px)' }} // Adjust 150px based on Nav + Header height
        ></iframe>
      </div>
    </div>
  );
};

export default Stocks;
