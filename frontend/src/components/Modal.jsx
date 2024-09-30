import React from 'react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    onClose();
    navigate('/login'); // Redirect to the login page
  };

  const handleSignupClick = () => {
    onClose();
    navigate('/signup'); // Redirect to the signup page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full transition-transform transform scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Welcome to KamanaBILLU</h2>
        <p className="text-gray-600 mb-6 text-center">Please choose an option:</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleLoginClick}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
          <button
            onClick={handleSignupClick}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Sign Up
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
