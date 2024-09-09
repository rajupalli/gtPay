"use client";

import { Input } from "@nextui-org/input";
import React, { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

export const PaymentMethodsContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [upiId, setUpiId] = useState("");
  const [upiIdConfirm, setUpiIdConfirm] = useState("");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountNoConfirm, setAccountNoConfirm] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [dailyLimit, setDailyLimit] = useState("");
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const [paymentType, setPaymentType] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpiIdChange = (e: React.ChangeEvent<HTMLInputElement>) => setUpiId(e.target.value);
  const handleUpiIdConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => setUpiIdConfirm(e.target.value);
  const handleBeneficiaryNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setBeneficiaryName(e.target.value);
  const handleAccountNoChange = (e: React.ChangeEvent<HTMLInputElement>) => setAccountNo(e.target.value);
  const handleAccountNoConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => setAccountNoConfirm(e.target.value);
  const handleIfscCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => setIfscCode(e.target.value);
  const handleBankNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setBankName(e.target.value);
  const handleDailyLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => setDailyLimit(e.target.value);

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setQrCode(e.target.files[0]);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleTabChange = (index: number) => {
    setTabValue(index);
    const type = index === 0 ? "QR/UPI Pay" : "Bank Transfer";
    setPaymentType(type);
    console.log("Payment Type:", type);
  };

  const handleSave = async () => {
    const formData = {
      upiId,
      upiIdConfirm,
      beneficiaryName,
      accountNo,
      accountNoConfirm,
      ifscCode,
      bankName,
      qrCode: qrCode ? URL.createObjectURL(qrCode) : '',
      dailyLimit,
      paymentType,
    };

    try {
      const response = await fetch('/api/bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data.message);
        return;
      }

      const result = await response.json();
      setBankDetails(result.data);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving bank details:', error);
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const response = await fetch('/api/bank');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setBankDetails(data);

          } else {
            console.error('Error: bank details are not in array format');
          }
        }
      } catch (error) {
        console.error('Error fetching bank details:', error);
      }
    };

    fetchBankDetails();
  }, []);

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-2">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-10 leading-5 text-primary">Active Bank Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(bankDetails) && bankDetails.filter(detail => detail.isActive).map((detail, index) => (
            <div
              key={index}
              className="bg-white shadow-lg border border-black rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-start p-4">
                <p className="text-paymentGrey text-xl font-semibold mb-1 leading-8">
                  Name : {detail.beneficiaryName}
                </p>
                <p className="text-paymentGrey font-semibold text-xl mb-1 leading-8">AC : {detail.accountNo}</p>
                <p className="text-paymentGrey font-semibold text-xl mb-1 leading-8">IFSC : {detail.ifscCode}</p>
                <p className="text-paymentGrey font-semibold text-xl mb-1 leading-8">Bank : {detail.bankName}</p>
                {/* <p className="text-paymentGrey font-semibold text-xl mb-1 leading-8">Payment Type: {detail.paymentType}</p> */}
              </div>
            </div>
          ))}

          {Array.isArray(bankDetails) && bankDetails.filter(detail => detail.isActive).map((detail, index) => (
            <div
              key={index}
              className="bg-white shadow-lg border border-black rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-start p-4">
                <p className="text-paymentGrey text-xl font-semibold mb-1 leading-8">
                  Name : {detail.beneficiaryName}
                </p>
                <p className="text-paymentGrey text-xl font-semibold mb-1 leading-8">UPI ID: {detail.upiId}</p>
                {/* <p className="text-paymentGrey font-semibold text-xl mb-1 leading-8">Payment Type: {detail.paymentType}</p> */}
              </div>
            </div>
          ))}

          <div
            className="bg-white shadow-lg border border-black rounded-lg p-4 w-64 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleOpenModal}
          >
            <div className="flex flex-col items-center justify-center">
              <FaPlus className="text-black font-bold text-5xl mb-1 mt-10" />
              <span className="text-black text-xl leading-5 font-semibold">
                Add New
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-20">
        <div>
          <h2 className="text-xl font-semibold mb-10 leading-5 text-primary">Inactive Bank Details</h2>
          {/* Render inactive bank details here */}
          {Array.isArray(bankDetails) && bankDetails.filter(detail => !detail.isActive).map((detail, index) => (
            <div key={index}>{detail.beneficiaryName} - {detail.bankName}</div>
          ))}
        </div>
      </div>

      {/* Modal for adding new bank details */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Active Bank Details</h2>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
              <button
                className={`py-2 md:py-4 px-4 w-full rounded-xl border-1 border-black  ${tabValue === 0 ? 'bg-primary text-black font-bold' : 'bg-white text-gray-500'}`}
                onClick={() => handleTabChange(0)}
              >
                QR/UPI Pay
              </button>
              <button
                className={`py-2 md:py-4 px-4 w-full rounded-xl border-1 border-black ${tabValue === 1 ? 'bg-primary text-black font-bold' : 'bg-white text-gray-500'}`}
                onClick={() => handleTabChange(1)}
              >
                Bank Transfer
              </button>
            </div>

            <div className="">
              {tabValue === 0 && (
                <div>
                  {/* QR/UPI Pay form */}
                  <div className="flex flex-col gap-4 mt-10">
                    <Input
                      label="Enter UPI ID"
                      value={upiId}
                      onChange={handleUpiIdChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Re-Enter UPI ID"
                      value={upiIdConfirm}
                      onChange={handleUpiIdConfirmChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Beneficiary Name"
                      value={beneficiaryName}
                      onChange={handleBeneficiaryNameChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div
                      className="bg-white shadow-lg border border-black rounded-lg p-4 w-28 cursor-pointer hover:bg-gray-100 transition-colors flex items-center justify-center mt-10"
                      onClick={handleCardClick}
                    >
                      <FaPlus className="text-black font-bold text-5xl mr-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrCodeUpload}
                        className="hidden"
                        ref={fileInputRef}
                      />
                    </div>
                    <span className="text-adminGrey text-xl leading-5 font-semibold">
                      Upload QR Code
                    </span>
                  </div>

                  <div className="mt-20">
                    <Input
                      label="Daily Limit"
                      value={dailyLimit}
                      onChange={handleDailyLimitChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                  </div>
                </div>
              )}

              {tabValue === 1 && (
                <div>
                  <div className="flex flex-col gap-4 mt-10">
                    <Input
                      label="Beneficiary Name"
                      value={beneficiaryName}
                      onChange={handleBeneficiaryNameChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Enter Account No"
                      value={accountNo}
                      onChange={handleAccountNoChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Re-Enter Account No"
                      value={accountNoConfirm}
                      onChange={handleAccountNoConfirmChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Enter IFSC Code"
                      value={ifscCode}
                      onChange={handleIfscCodeChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                    <Input
                      label="Enter Bank Name"
                      value={bankName}
                      onChange={handleBankNameChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                  </div>

                  <div className="mt-20">
                    <Input
                      label="Daily Limit"
                      value={dailyLimit}
                      onChange={handleDailyLimitChange}
                      className="w-full text-xl bg-transparent rounded-xl border-1 border-black"
                      style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8 gap-4 w-full">
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 border border-red-500 w-full"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                className="mt-4 bg-greenSubmit text-white px-4 py-2 rounded hover:bg-green-700 border-green-500 w-full"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};