import React, { useState, useEffect } from "react";
import { IUser } from "@/model/userDetails"; // Adjust the path to where IUser is defined

interface AddUserFormProps {
  onClose: () => void;
  existingUser?: IUser | null; // Optional prop to pre-fill the form for editing
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, existingUser }) => {
  const [formData, setFormData] = useState({
    role: "Super Admin",
    name: "",
    companyName: "",
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  // Pre-fill the form with existing user data if editing
  useEffect(() => {
    if (existingUser) {
      setFormData({
        role: existingUser.type,
        name: existingUser.name,
        companyName: existingUser.companyName,
        userName: existingUser.userName,
        password: "", // Password should not be pre-filled for security reasons
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        alternateNumber: existingUser.alternateNumber || "",
      });
    }
  }, [existingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button while submitting
  
    try {
      // Ensure the formData uses the correct field names for the backend schema
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: formData.role, // Send the role as 'type'
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("User added successfully:", result);
      alert('User added successfully!'); // You can replace this with a modal or any other UI feedback
    } catch (error) {
      console.error("Failed to add user:", error);
      alert('Failed to add user.');
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
      onClose(); // Close the form after submission
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg relative">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New User</h2>
          <button
            onClick={onClose}
            className="text-red-500 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Dropdown for Role */}
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Super Admin">Super Admin</option>
              <option value="Client">Client</option>
              <option value="Admin">Admin</option>
              <option value="Banking Manager">Banking Manager</option>
            </select>
          </div>

          {/* Text fields */}
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">User Name</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
                  <div className="mb-4">
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Enter 10-digit phone number"
            pattern="\d{10}" // Optional: Enforce 10 digits in the UI as well
          />
        </div>

          <div className="mb-4">
            <label className="block text-gray-700">Alternate Number</label>
            <input
              type="text"
              name="alternateNumber"
              value={formData.alternateNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="py-2 px-4 w-full bg-green-500 text-white rounded-lg"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
