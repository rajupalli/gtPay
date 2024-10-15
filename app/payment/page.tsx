"use client"; // Client component directive

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';  // Import useParams to access dynamic route segments

export default function SignIn() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (clientId && mobileNumber && amount) {
      try {
        // Redirect with clientId, mobileNumber, and amount in the URL
        router.push(`/${clientId}/${mobileNumber}/${amount}`);
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong, please try again later.');
      }
    } else {
      alert('Please provide client ID, mobile number, and amount.');
    }
  };

  const handleCloseSite = () => {
    window.close();
  };

  return (
    <div>
      {showErrorPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <h2 className="text-lg font-bold mb-4">Error</h2>
            <p className="mb-4">Client ID is invalid or missing. Please check the URL and try again.</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCloseSite}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {!showErrorPopup && (
        <>
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
              <div className="flex justify-center mb-4">
                {/* Logo Image */}
                <Image
                  src="/logo.png"
                  alt="ACME Logo"
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-center mb-6">Welcome to payment page</h1>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Client ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
