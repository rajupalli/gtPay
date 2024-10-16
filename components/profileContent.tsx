import React, { useState, useEffect } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { BsCheckCircle, BsExclamationCircle } from "react-icons/bs";

interface UserData {
  UserName: string;
  AppPassword: string;
  ClientId: string;
  CompanyName: string;
  MobileNumber: string;
  Role: string;
}

interface ApiResponse {
  statusCode: number;
  transactionStatus: boolean;
  amount?: number;
  utr?: string;
  date?: string;
  time?: string;
  message?: string;
}

const ProfileContent: React.FC<{ clientId: string; userId: string }> = ({ clientId, userId }) => {
  const [activeTab, setActiveTab] = useState<"success" | "error">("success");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiSuccessResponse: ApiResponse = {
    statusCode: 200,
    transactionStatus: true,
    amount: 500.0,
    utr: "UTR123456789",
    date: "2024-10-05",
    time: "14:35:20",
  };

  const apiErrorResponse: ApiResponse = {
    statusCode: 400,
    transactionStatus: false,
    message: "Transaction is pending",
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/findUser?clientId=${clientId}&userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setUserData({
            UserName: data.data.userName,
            AppPassword: data.data.appPassword?? "app@123", // Placeholder password, this should come from API if required
            ClientId: data.data.clientId,
            CompanyName:data.data.companyName?? "ABC Corp", // Placeholder, replace with actual data if available
            MobileNumber: data.data.mobileNumber,
            Role: data.data.role,
          });
        } else {
          setError(data.message || "Failed to fetch user data");
        }
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [clientId, userId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!userData) {
    return <div>No user data available</div>;
  }

  return (
    <div className="w-full bg-white shadow rounded overflow-hidden">
      {/* Header */}

      {/* Profile Overview */}
      <div className="p-6 space-y-4">
        <h2 className="text-3xl font-bold">Profile Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(userData)
            .filter(([key]) => key !== "apiUrl")
            .map(([key, value]) => (
              <div key={key} className="flex items-center">
                <label className="w-1/3 text-sm font-medium text-gray-600">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <div className="w-2/3 relative">
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="w-full border rounded px-4 py-2 text-gray-700 bg-gray-50 focus:ring focus:ring-blue-400"
                    onClick={() => handleCopy(value)}
                  />
                  <AiOutlineCopy
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
                    onClick={() => handleCopy(value)}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* API URL */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">API URL</label>
          <div className="relative">
            <input
              type="text"
              value={`https://api.example.com/v1/${clientId}`}
              readOnly
              className="w-full border rounded px-4 py-2 text-gray-700 bg-gray-50 focus:ring focus:ring-blue-400"
              onClick={() => handleCopy(`https://api.example.com/v1/${clientId}`)}
            />
            <AiOutlineCopy
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
              onClick={() => handleCopy(`https://api.example.com/v1/${clientId}`)}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t">
        <div className="flex">
          <button
            className={`flex-1 py-3 text-center text-sm font-medium transition-all ${
              activeTab === "success"
                ? "bg-green-100 text-green-600 border-b-2 border-green-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("success")}
          >
            <BsCheckCircle className="inline mr-2" />
            Success
          </button>
          <button
            className={`flex-1 py-3 text-center text-sm font-medium transition-all ${
              activeTab === "error"
                ? "bg-red-100 text-red-600 border-b-2 border-red-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("error")}
          >
            <BsExclamationCircle className="inline mr-2" />
            Error
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 bg-gray-50">
          {activeTab === "success" ? (
            <pre className="bg-green-50 p-4 rounded text-sm text-green-900 shadow-inner">
              {JSON.stringify(apiSuccessResponse, null, 2)}
            </pre>
          ) : (
            <pre className="bg-red-50 p-4 rounded text-sm text-red-900 shadow-inner">
              {JSON.stringify(apiErrorResponse, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
