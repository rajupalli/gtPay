"use client";

import React, { useState, useEffect } from "react";
import { DashboardContent } from "./DashboardContent";
import { PaymentMethodsContent } from "./PaymentMethodContent";
import AddUserForm from './addUserForm';
import AllUsersContent  from './AllUsersContent';
import { PaymentHistoryContent } from "./PaymentHistoryContent";
import { FaTachometerAlt, FaCreditCard, FaHistory, FaQuestionCircle, FaUserCog, FaUsers, FaSignOutAlt,FaUser ,} from "react-icons/fa";
import { HelpAndSupport } from "./HelpAndSupport";
import { Navbar } from "./navbar";
import { useParams } from 'next/navigation';
import ProfileContent from "./profileContent";
import ClientAdminContent from "./clientAdminContent";


export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [isUserAdminExpanded, setIsUserAdminExpanded] = useState(false); // New state for tracking the expansion of "User Administration"
  const [isAddUserFormVisible, setIsAddUserFormVisible] = useState(false); // State to show AddUserForm
  const { clientId, userId } = useParams(); 
  const [showErrorPopup, setShowErrorPopup] = useState(false);


  const handleLogout = () => {
    // Perform logout functionality here, such as clearing user session or redirecting to login
    console.log("User logged out");
    window.location.href = "/"; // Redirect to login page after logout
  };


  useEffect(() => {
    if(clientId!=="superAdmin"){
    const checkClientId = async () => {
      try {
        const response = await fetch(`/api/checkClientId?clientId=${clientId}`);
        const data = await response.json();

        if (!data.exists) {
          setShowErrorPopup(true); // Show the error popup if clientId is not found
        }
      } catch (error) {
        console.error("Error checking client ID:", error);
        setShowErrorPopup(true); // Handle error by showing the error popup
      }
    };
  
    if (clientId) {
      checkClientId();
    } else {
      setShowErrorPopup(true); // Show popup if clientId is missing
    }}
  }, [clientId]);

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
      <Navbar showTransactionId={false} />
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-white text-black p-4 flex flex-col fixed top-[65px] border-r border-gray-400">
          <ul className="space-y-4">
            <li
              className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "home" ? "bg-gray-100" : ""
                }`}
              onClick={() => setActiveItem("home")}
            >
              <FaTachometerAlt className={`text-xl ${activeItem === "home" ? "text-primary" : "text-black"}`} />
              <span className="text-center">Dashboard</span>
            </li>
            <li
              className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "paymentMethods" ? "bg-gray-100 " : ""
                }`}
              onClick={() => setActiveItem("paymentMethods")}
            >
              <FaCreditCard className={`text-xl ${activeItem === "paymentMethods" ? "text-primary" : "text-black"}`} />
              <span className="text-center">Payment Methods</span>
            </li>
            <li
              className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "paymentHistory" ? "bg-gray-100 " : ""
                }`}
              onClick={() => setActiveItem("paymentHistory")}
            >
              <FaHistory className={`text-xl ${activeItem === "paymentHistory" ? "text-primary" : "text-black"}`} />
              <span className="text-center">Payment History</span>
            </li>
            <li
              className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "helpSupport" ? "bg-gray-100" : ""
                }`}
              onClick={() => setActiveItem("helpSupport")}
            >
              <FaQuestionCircle className={`text-xl ${activeItem === "helpSupport" ? "text-primary" : "text-black"}`} />
              <span className="text-center">Help & Support</span>
            </li>
          
            <li
              className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "userAdmin" ? "bg-gray-100" : ""
                }`}
              onClick={() => {
                setActiveItem("userAdmin");
                setIsUserAdminExpanded(!isUserAdminExpanded); // Toggle the expanded state
              }}
            >
              <FaUserCog className={`text-xl ${activeItem === "userAdmin" ? "text-primary" : "text-black"}`} />
              <span className="text-center">User Administration</span>
            </li>
          
      <li
                  className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
                    activeItem === "profile" ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setActiveItem("profile")}
                >
                  <FaUser className={`text-xl ${activeItem === "profile" ? "text-primary" : "text-black"}`} />
                  <span className="text-center">Profile</span>
                </li>

                <li
                  className="cursor-pointer p-2 flex items-center space-x-4 rounded hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-xl text-black" />
                  <span className="text-center">Logout</span>
                </li>
          </ul>
        </div>

        {/* Content */}
        <div className="ml-64 p-10 w-full">
          {activeItem === "home" && <DashboardContent clientId={Array.isArray(clientId) ? clientId[0] : clientId}/>}
          {activeItem === "paymentMethods" && <PaymentMethodsContent clientId={Array.isArray(clientId) ? clientId[0] : clientId} />}
          {activeItem === "paymentHistory" && <PaymentHistoryContent clientId={Array.isArray(clientId) ? clientId[0] : clientId}/>}
          {activeItem === "helpSupport" && <HelpAndSupport />}
          
          {activeItem === "userAdmin" && (
  clientId === 'superAdmin' ? 
    <AllUsersContent clientId={Array.isArray(clientId) ? clientId[0] : clientId} /> 
    : 
    <ClientAdminContent clientId={Array.isArray(clientId) ? clientId[0] : clientId} />
)}

          {activeItem === "profile" && <ProfileContent clientId={Array.isArray(clientId) ? clientId[0] : clientId} userId={Array.isArray(userId) ? userId[0] : userId}/>} 
        </div>
      </div></>
      )}
    </div>
  );
};
