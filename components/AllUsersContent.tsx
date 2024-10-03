"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUserForm from "./addUserForm";
import { FaPen } from "react-icons/fa"; // Import pencil icon
import { IUser } from "@/model/userDetails"; // Import the IUser interface

export const AllUsersContent: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null); // To hold the user data when editing

  // Fetch all users from the backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Replace with your actual API endpoint
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter and search functionality
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "All" || user.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle Edit Button click (open form with user data)
  const handleEditClick = (user: IUser) => {
    setSelectedUser(user); // Set the selected user
    setIsEditFormVisible(true); // Show the edit form
  };

  return (
    <div className="p-6">
      {/* Search Bar and Filter */}
      <div className="flex justify-between items-center mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search User by Name, Email, or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-grow mr-4"
        />

        {/* Filter by User Type */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Client">Client</option>
          <option value="Admin">Admin</option>
          <option value="Banking Manager">Banking Manager</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Sl.No.</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Company Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone Number</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user.id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.companyName}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phoneNumber}</td>
              <td className="border px-4 py-2">{user.type}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => handleEditClick(user)}
                >
                  <FaPen /> {/* Pencil icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit User Form */}
      {isEditFormVisible && selectedUser && (
        <AddUserForm
          onClose={() => setIsEditFormVisible(false)}
          existingUser={selectedUser} // Pass the selected user as a prop to pre-fill the form
        />
      )}
    </div>
  );
};


export default AllUsersContent;