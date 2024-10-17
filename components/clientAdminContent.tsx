"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUserForm from "./addUserForm";
import { FaPen } from "react-icons/fa";

interface ClientAdmin {
  type: 'Admin' | 'Banking Manager';
  name: string;
  userName: string;
  password: string;
  clientId: string;
  phoneNumber?: string;
  createdAt?: string;
}

interface ClientAdminContentProps {
  clientId: string;
}

const ClientAdminContent: React.FC<ClientAdminContentProps> = ({ clientId }) => {
  const [clientAdmins, setClientAdmins] = useState<ClientAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<ClientAdmin | null>(null);

  const roleOptions = ["Admin", "Banking Manager"];

  // Fetch ClientAdmin data
  useEffect(() => {
    const fetchClientAdmins = async () => {
      try {
        const response = await axios.get("/api/ClientAdmin", {
          params: { clientId },
        });
  
        const data = response.data;
  
        // Ensure data is extracted correctly from the response
        const admins = Array.isArray(data.data) ? data.data : [];
  
        // Set the state with the extracted data
        setClientAdmins(admins);
  
        console.log("ClientAdmin data:", admins); // For debugging purposes
  
      } catch (error) {
        console.error("Error fetching client admins:", error);
        setClientAdmins([]); // Set state to an empty array on error
      }
    };
  
    fetchClientAdmins();
  }, [clientId]);
  
  // Filter ClientAdmin data
  const filteredAdmins = clientAdmins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.phoneNumber && admin.phoneNumber.includes(searchTerm));

    const matchesFilter = filterType === "All" || admin.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle Edit Click
  const handleEditClick = (admin: ClientAdmin) => {
    setSelectedAdmin(admin);
    setIsEditFormVisible(true);
  };

  return (
    <div className="p-6 relative">
      {/* Search and Filter Section */}
      <div className="flex justify-between items-center mb-4 relative">
        <input
          type="text"
          placeholder="Search Admin by Name, Username, or Mobile"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-grow mr-4"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded mr-4"
        >
          <option value="All">All</option>
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setIsAddFormVisible(true)}
          
        >
          Add New Admin
        </button>
      </div>

      {/* Admins Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Sl.No.</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Mobile</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin, index) => (
              <tr key={admin.userName} className="text-center">
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{admin.name}</td>
                <td className="border px-4 py-2">{admin.userName}</td>
                <td className="border px-4 py-2">{admin.phoneNumber || "N/A"}</td>
                <td className="border px-4 py-2">{admin.type}</td>
                <td className="border px-4 py-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditClick(admin)}
                  >
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Admin Form */}
      {isEditFormVisible && selectedAdmin && (
        <AddUserForm
          onClose={() => setIsEditFormVisible(false)}
         // existingUser={selectedAdmin}
          clientId={clientId}
        />
      )}

      {/* Add Admin Form */}
      {isAddFormVisible && (
        <AddUserForm onClose={() => setIsAddFormVisible(false)} clientId={clientId} />
      )}
    </div>
  );
};

export default ClientAdminContent;
