"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import AddUserForm from "./addUserForm";
import { FaPen } from "react-icons/fa"; // Import pencil icon
import { IUser } from "@/model/userDetails"; // Import the IUser interface

interface AllUsersContentProps {
  clientId: string; // Expect clientId as a prop
}

interface ClientAdmin {
  type: 'Admin' | 'Banking Manager';
  name: string;
  id:string;
  userName: string;
  password: string;
  clientId: string;
  email:string;
  phoneNumber?: string;
  createdAt?: string;
}



const AllUsersContent: React.FC<AllUsersContentProps> = ({ clientId }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const roleOptions =
    clientId === "superAdmin"
      ? ["Super Admin", "Client"]
      : ["Admin", "Banking Manager"];

  // Fetch Users based on clientId
  useEffect(() => {
    const fetchUsers = async () => {
      const apiUrl ="/api/user" ;
      try {
        const response = await axios.get(apiUrl, {
          params: { clientId },
        });
        const data = response.data;

        // Ensure data is an array before setting state
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Ensure users remains an empty array on error
      }
    };

    fetchUsers();
  }, [clientId]);

  // Filter and Search Functionality
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "All" || user.type === filterType;
    return matchesSearch && matchesFilter;
  });


  // Inside AllUsersContent component

  const convertToIUser = (user: IUser | ClientAdmin): IUser => {
    if ("type" in user && user.type === "Admin" || user.type === "Banking Manager") {
      // Assuming necessary fields from ClientAdmin are here, and adding default values for IUser fields
      return {
        ...user,
        companyName: "Default Company",   // Default or derived value
        appPassword: "defaultPassword",   // Default or derived value
        domain: "defaultDomain",          // Default or derived value
        // You can add other IUser-specific fields here
      } as IUser;
    }
    return user as IUser;  // If it's already IUser, return as is
  };

  
  const handleUserSubmit = (newUser: IUser | ClientAdmin) => {
    const convertedUser = convertToIUser(newUser);  // Ensure it's an IUser

    if (convertedUser.id) {
      // Update existing user in the list
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === convertedUser.id ? convertedUser : user))
      );
    } else {
      // Add new user to the list
      setUsers((prevUsers) => [...prevUsers, convertedUser]);
    }
  };
  

  // Handle Edit Button Click
  const handleEditClick = (user: IUser) => {
    setSelectedUser(user); // Set selected user data for editing
    setIsEditFormVisible(true); // Open the edit form
  };

  return (
    <div className="p-6 relative">
      {/* Search Bar and Filter Section */}
      <div className="flex justify-between items-center mb-4 relative">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search User by Name, Email, or Phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded flex-grow mr-4"
        />

        {/* Filter Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded mr-4"
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        {/* Add New User Button */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => setIsAddFormVisible(true)}
        >
          Add New User
        </button>
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
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
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit User Form */}
      {isEditFormVisible && selectedUser && (
        <AddUserForm
          onClose={() => setIsEditFormVisible(false)}
          existingUser={selectedUser}
          clientId={clientId}
          onUserSubmit={handleUserSubmit}  
        />
      )}

      {/* Add User Form */}
      {isAddFormVisible && (
        <AddUserForm onClose={() => setIsAddFormVisible(false)} clientId={clientId}  onUserSubmit={handleUserSubmit}   />
      )}
    </div>
  );
};

export default AllUsersContent;
