"use client";

import React, { useState } from "react";
import { DashboardContent } from "./DashboardContent";
import { PaymentMethodsContent } from "./PaymentMethodContent";
import AddUserForm from './addUserForm';
import AllUsersContent  from './AllUsersContent';
import { PaymentHistoryContent } from "./PaymentHistoryContent";
import { FaTachometerAlt, FaCreditCard, FaHistory, FaQuestionCircle, FaUserCog, FaUsers, FaUserPlus } from "react-icons/fa";
import { HelpAndSupport } from "./HelpAndSupport";
import { Navbar } from "./navbar";
import { useParams } from 'next/navigation';


export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("home");
  const [isUserAdminExpanded, setIsUserAdminExpanded] = useState(false); // New state for tracking the expansion of "User Administration"
  const [isAddUserFormVisible, setIsAddUserFormVisible] = useState(false); // State to show AddUserForm
  const { clientId } = useParams(); 
  return (
    <div>
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
            {/* Conditionally render the two additional options when User Administration is expanded */}
            {isUserAdminExpanded && (
              <ul className="ml-8 space-y-0">
                <li
                  className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "viewAllUsers" ? "bg-gray-100" : ""
                    }`}
                  onClick={() => setActiveItem("viewAllUsers")}
                > <FaUsers className={`text-xl ${activeItem === "userAdmin" ? "text-primary" : "text-black"}`} />
                  <span className="text-center">View All Users</span>
                </li>
                <li
                  className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${activeItem === "addNewUser" ? "bg-gray-100" : ""
                    }`}
                  onClick={() => {
                    setActiveItem("addNewUser");
                    setIsAddUserFormVisible(true); // Open the Add User Form modal
                  }}
                >
                  <FaUserPlus className="text-xl" />
                  <span className="text-center">Add New User</span>
                </li>
              </ul>
            )}
          </ul>
        </div>

        {/* Content */}
        <div className="ml-64 p-10 w-full">
          {activeItem === "home" && <DashboardContent />}
          {activeItem === "paymentMethods" && <PaymentMethodsContent clientId={Array.isArray(clientId) ? clientId[0] : clientId} />}
          {activeItem === "paymentHistory" && <PaymentHistoryContent clientId={Array.isArray(clientId) ? clientId[0] : clientId}/>}
          {activeItem === "helpSupport" && <HelpAndSupport />}
          {activeItem === "viewAllUsers" && <AllUsersContent />} {/* Call the AllUsersContent component */}
          {/* Modal for Add New User */}
          {isAddUserFormVisible && (
            <AddUserForm onClose={() => setIsAddUserFormVisible(false)} />
          )}
        </div>
      </div>
    </div>
  );
};
