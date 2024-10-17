import React, { useState, useEffect } from "react";
import { IUser } from "@/model/userDetails"; // Adjust the path if needed
import { AiOutlineClose } from "react-icons/ai"; // Optional icon for better UI
 




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


interface AddUserFormProps {
  onClose: () => void;
  existingUser?: IUser | ClientAdmin | null;
  clientId: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({
  onClose,
  existingUser,
  clientId,
}) => {
  const roleOptions =
    clientId === "superAdmin"
      ? ["Super Admin", "Client"]
      : ["Admin", "Banking Manager"];

  // Pre-fill form if editing an existing user
  const [formData, setFormData] = useState({
    role: roleOptions[0],
    name: "",
    companyName: "",
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    alternateNumber: "",
    appPassword: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form data if editing an existing user
  useEffect(() => {
    if (existingUser) {
      setFormData({
        role: existingUser.type,
        name: existingUser.name || "", // Safe access with fallback to empty string
        companyName: "companyName" in existingUser ? existingUser.companyName || "" : "", // Check if companyName exists
        userName: existingUser.userName || "",
        password: "", // Keep password empty for security reasons
        email: existingUser.email , // Check if email exists
        phoneNumber: existingUser.phoneNumber || "",
        alternateNumber: "alternateNumber" in existingUser ? existingUser.alternateNumber || "" : "", // Check if alternateNumber exists
        appPassword: "",
      });
    }
  }, [existingUser]);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(""); // Clear previous password error

    // Check if passwords match (only if the password is being edited)
    if (formData.password && formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true); // Indicate form is submitting

    try {
      // Choose API route based on whether we are adding or editing
      const apiUrl = clientId === "superAdmin" 
        ? `/api/user${existingUser ? `/${existingUser.id}` : ""}` 
        : `/api/ClientAdmin${existingUser ? `/${existingUser.id}` : ""}`;
      
      const method = existingUser ? "PUT" : "POST"; // Use PUT for editing, POST for adding

      console.log(formData);
      console.log(apiUrl);

      // Make the API request
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: formData.role,
          clientId,
        }),
      });

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.statusText}`);
      }

      // Handle successful response
      const result = await response.json();
      console.log("User operation successful:", result);
      alert(`User ${existingUser ? "updated" : "added"} successfully!`);
    } catch (error: any) {
      console.error("Failed to process user:", error);
      alert(`Failed to ${existingUser ? "update" : "add"} user: ` + error.message);
    } finally {
      setIsSubmitting(false); // Stop submission indicator
      onClose(); // Close the form modal
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            {existingUser ? "Edit User" : "Add New User"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <AiOutlineClose size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["name", "userName", "email", "phoneNumber"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field.includes("Number") ? "tel" : "text"}
                  name={field}
                  value={formData[field as keyof typeof formData]}
                  onChange={handleChange}
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
                  placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                />
              </div>
            ))}

            {/* Conditionally render companyName and alternateNumber if role is Client */}
            {formData.role === "Client" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alternate Phone Number</label>
                  <input
                    type="tel"
                    name="alternateNumber"
                    value={formData.alternateNumber}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
                    placeholder="Enter alternate phone number"
                  />
                </div>
              </>
            )}
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
                placeholder={existingUser ? "Enter new password (if changing)" : "Enter password"}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
                placeholder="Confirm password"
              />
              {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`py-2 px-4 text-white rounded-lg ${isSubmitting ? "bg-green-300" : "bg-green-500 hover:bg-green-600"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : existingUser ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
