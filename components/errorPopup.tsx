import React, { useState } from 'react';

interface ErrorPopupProps {
  error: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ error }) => {
  const [isVisible, setIsVisible] = useState(true); // To handle visibility of the popup

  const handleClose = () => {
    setIsVisible(false); // Hide the popup when 'OK' is clicked
  };

  if (!isVisible) return null; // Do not render the popup if it is not visible

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-red-500 mb-4">Error</h2>
        <p className="text-gray-800 mb-4">{error}</p>
        <button
          onClick={handleClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorPopup;
