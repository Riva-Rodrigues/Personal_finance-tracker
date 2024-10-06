import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const ChatModal = ({ visible, onClose }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Update chat history with user message
    setChatHistory([...chatHistory, { sender: 'You', message: inputMessage }]);

    // Call the backend API
    try {
      const response = await fetch('http://localhost:8000/api/v1/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update chat history with AI response
        setChatHistory([...chatHistory, { sender: 'You', message: inputMessage }, { sender: 'AI', message: data.response }]);
        setInputMessage('');
      } else {
        console.error(data.error);
        setChatHistory([...chatHistory, { sender: 'AI', message: 'Error: ' + data.error }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory([...chatHistory, { sender: 'AI', message: 'Error: Unable to connect to server' }]);
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
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md">
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