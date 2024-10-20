import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { generateDescription } from '../utils/chatb';

const ChatModal = ({ visible, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newChatHistory = [...chatHistory, { sender: 'You', message: inputMessage }];
    setChatHistory(newChatHistory);

    try {
      const transactionResponse = await fetch('http://localhost:8000/api/v1/trans', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
        },
      });

      const accountResponse = await fetch('http://localhost:8000/api/v1/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
        },
      });
      const billResponse = await fetch('http://localhost:8000/api/v1/bills', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("accessToken")}` 
        },
      });

      const transactions = await transactionResponse.json();
      const accounts = await accountResponse.json();
      const bills = await billResponse.json();

      if (!transactionResponse.ok || !accountResponse.ok || !billResponse.ok) {
        throw new Error('Failed to fetch transactions or accounts');
      }

      const aiResponse = await generateDescription(inputMessage, transactions, accounts, bills);

      if (aiResponse) {
        setChatHistory(prev => [...prev, { sender: 'AI', message: aiResponse }]);
      } else {
        setChatHistory(prev => [...prev, { sender: 'AI', message: 'Error: No response from AI.' }]);
      }

      setInputMessage(''); 
    } catch (error) {
      console.error('Error generating message:', error);
      setChatHistory(prev => [...prev, { sender: 'AI', message: 'Error: Unable to process the message.' }]);
    }
  };

  return (
    <Modal
      title="Chat with AI"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="rounded-lg"
    >
      <div className="flex flex-col h-[400px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md mb-2">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`my-2 ${chat.sender === 'You' ? 'text-right' : 'text-left'}`}>
              <span className={`font-bold ${chat.sender === 'You' ? 'text-blue-600' : 'text-gray-800'}`}>
                {chat.sender}:
              </span>
              <span className={`ml-2 inline-block p-2 rounded-lg ${chat.sender === 'You' ? 'bg-blue-200' : 'bg-gray-300'}`}>
                {chat.message}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <Input
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onPressEnter={handleSendMessage}
            className="flex-1 border-gray-300 rounded-lg"
          />
          <Button type="primary" onClick={handleSendMessage} className="ml-2">
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatModal;
