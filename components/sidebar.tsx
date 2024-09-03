"use client";

import React, { useState } from "react";
import { DashboardContent } from "./DashboardContent";
import { PaymentMethodsContent } from "./PaymentMethodContent";
import { PaymentHistoryContent } from "./PaymentHistoryContent";
import { FaTachometerAlt, FaCreditCard, FaHistory, FaQuestionCircle, FaUserCog } from "react-icons/fa"; // Import icons
import { HelpAndSupport } from "./HelpAndSupport";
import { UserAdministration } from "./UserAdministration";

export const Sidebar = () => {
  const [activeItem, setActiveItem] = useState("home");

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-white text-black p-4 flex flex-col fixed top-[65px] border-r border-gray-400"> 
        <ul className="space-y-4">
          <li
            className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
              activeItem === "home" ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveItem("home")}
          >
            <FaTachometerAlt className={`text-xl ${activeItem === "home" ? "text-primary" : "text-black"}`} />
            <span className="text-center">Dashboard</span>
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
              activeItem === "paymentMethods" ? "bg-gray-100 " : ""
            }`}
            onClick={() => setActiveItem("paymentMethods")}
          >
            <FaCreditCard className={`text-xl ${activeItem === "paymentMethods" ? "text-primary" : "text-black"}`} />
            <span className="text-center">Payment Methods</span>
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
              activeItem === "paymentHistory" ? "bg-gray-100 " : ""
            }`}
            onClick={() => setActiveItem("paymentHistory")}
          >
            <FaHistory className={`text-xl ${activeItem === "paymentHistory" ? "text-primary" : "text-black"}`} />
            <span className="text-center">Payment History</span>
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
              activeItem === "helpSupport" ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveItem("helpSupport")}
          >
            <FaQuestionCircle className={`text-xl ${activeItem === "helpSupport" ? "text-primary" : "text-black"}`} />
            <span className="text-center">Help & Support</span>
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center space-x-4 rounded ${
              activeItem === "userAdmin" ? "bg-gray-100" : ""
            }`}
            onClick={() => setActiveItem("userAdmin")}
          >
            <FaUserCog className={`text-xl ${activeItem === "userAdmin" ? "text-primary" : "text-black"}`} />
            <span className="text-center">User Administration</span>
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="ml-64 p-10 w-full">
        {activeItem === "home" && <DashboardContent />}
        {activeItem === "paymentMethods" && <PaymentMethodsContent />}
        {activeItem === "paymentHistory" && <PaymentHistoryContent />}
        {activeItem === "helpSupport" && <HelpAndSupport />}
        {activeItem === "userAdmin" && <UserAdministration />}
      </div>
    </div>
  );
};
