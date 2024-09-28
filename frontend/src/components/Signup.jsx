import React from 'react';

const SignupForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 via-black to-blue-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4">Create an account</h2>
        <p className="text-gray-600 mb-6">
          Already have an account? <a href="#" className="text-blue-600 font-medium">Log in</a>
        </p>
        
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">User name</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Enter your user name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">Use 8 or more characters with a mix of letters, numbers & symbols</p>
          </div>
          
          <div className="mb-6">
            <button 
              type="submit" 
              className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create an account
            </button>
          </div>
          
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our <a href="#" className="text-blue-600">Terms of use</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
