import React, { useState, useEffect } from "react";
import { IUser } from "@/model/userDetails"; // Adjust the path if needed
import { AiOutlineClose } from "react-icons/ai"; // Optional icon for better UI

interface AddUserFormProps {
  onClose: () => void;
  existingUser?: IUser | null;
  clientId: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, existingUser, clientId }) => {


  const roleOptions = clientId === "superAdmin"
  ? ["Super Admin", "Client"]
  : ["Admin", "Banking Manager"];



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

  useEffect(() => {
    if (existingUser) {
      setFormData({
        role: existingUser.type,
        name: existingUser.name,
        companyName: existingUser.companyName,
        userName: existingUser.userName,
        password: "",
        email: existingUser.email,
        phoneNumber: existingUser.phoneNumber,
        alternateNumber: existingUser.alternateNumber || "",
        appPassword: "",
      });
    }
  }, [existingUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (formData.password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: formData.role,
          clientId: clientId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("User added successfully:", result);
      alert("User added successfully!");
    } catch (error: any) {
      console.error("Failed to add user:", error);
      alert("Failed to add user: " + error.message);
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Add New User</h2>
         
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
        {["name", "companyName", "userName", "email", "phoneNumber", "alternateNumber"].map((field) => (
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
            placeholder="Enter password"
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white rounded-lg ${
              isSubmitting ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
