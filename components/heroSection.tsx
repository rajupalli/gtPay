"use client";

import { Input } from "@nextui-org/input";
import React, { useEffect, useState } from "react";
import { FiCopy } from "react-icons/fi";
import axios from "axios";


interface HeroSectionProps {
    transactionId: string; // Add the prop type for transactionId
  }

export default function HeroSection({ transactionId }: HeroSectionProps) {
    const [activeContent, setActiveContent] = useState("qr/upi pay");
    const [timeRemaining, setTimeRemaining] = useState(180);
    const [amount, setAmount] = useState("");
    const totalApprovedAmount=0;
    const [utr, setUtr] = useState("");
    const [upiId, setUpiId] = useState({
        beneficiaryName: '',
        upiId: '',
        qrCode: '',
        dailyLimit: '',
        activeDays: [],
        activeMonths: [],
        isActive: false,
    });
    const [bankDetails, setBankDetails] = useState({
        name: "",
        accountNo: "",
        ifsc: "",
        bankName: "",
        qrCodeUrl: "",
    });
    
    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const response = await fetch('/api/bank');
                const result = await response.json(); // Get the whole response object
                console.log("fetching bank details");
                console.log(result);
    
                // Check if result.data exists and is an array
                if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                    const bankInfo = result.data[0]; // First bank record
                    
                    if (bankInfo) {
                        setBankDetails({
                            name: bankInfo.beneficiaryName,
                            accountNo: bankInfo.accountNo,
                            ifsc: bankInfo.IFSCcode,
                            bankName: bankInfo.bankName,
                            qrCodeUrl: bankInfo.qrCode,
                        });
                    }
                } else {
                    console.error("Bank details are not in the expected format.");
                }
            } catch (error) {
                console.error("Error fetching bank details:", error);
            }
        };
    
        fetchBankDetails();
    }, []);
    


    useEffect(() => {
        const fetchUpiDetails = async () => {
            console.log('Fetching UPI details');
            try {
                const response = await fetch('/api/upi'); // Assuming this is the correct route for your GET UPI API
                const result = await response.json();
    
                console.log('Fetching UPI details');
                console.log(result);
    
                if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
                    let upiInfo = null;
    
                    if (Number(amount) === 0) {
                        // Show default first item in data
                        upiInfo = result.data[0];
                    } else {
                        // Find based on condition
                        upiInfo = result.data.find((upiRecord: any) => {
                            const dailyLimitAsNumber = Number(upiRecord.dailyLimit); // Convert dailyLimit to number
                            const totalApprovedAmountAsNumber = Number(totalApprovedAmount); // Convert totalApprovedAmount to number
                            const amountAsNumber = Number(amount); // Convert amount to number
    
                            return dailyLimitAsNumber >= (totalApprovedAmountAsNumber + amountAsNumber);
                        });
                    }
    
                    if (upiInfo) {
                        // If a UPI record is found, set it
                        setUpiId({
                            beneficiaryName: upiInfo.beneficiaryName,
                            upiId: upiInfo.upiId,
                            qrCode: upiInfo.qrCode,
                            dailyLimit: upiInfo.dailyLimit,
                            activeDays: upiInfo.activeDays,
                            activeMonths: upiInfo.activeMonths,
                            isActive: upiInfo.isActive,
                        });
                    } else {
                        // If no UPI record is found, set empty UPI info
                        setUpiId({
                            beneficiaryName: '',
                            upiId: '',
                            qrCode: '',
                            dailyLimit: '',
                            activeDays: [],
                            activeMonths: [],
                            isActive: false,
                        });
                        console.error('No UPI details meet the required condition.');
                    }
                } else {
                    console.error('UPI details are not in the expected format or empty.');
                }
            } catch (error) {
                console.error('Error fetching UPI details:', error);
            }
        };
    
        fetchUpiDetails(); // Fetch UPI details by default or when amount changes
    }, [totalApprovedAmount, amount]); // Ensure it re-fetches if these values change
    


    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert(`${text} copied to clipboard!`);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure the value is a positive number or empty
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only 12 digits in the UTR field
        if (/^\d{0,12}$/.test(value)) {
            setUtr(value);
        }
    };
   

    const handleSubmit = async (transactionType: string) => {
        // Validate UTR (Unique Transaction Reference)
        if (utr.length !== 12) {
            alert("Transaction reference number (UTR) must be exactly 12 digits.");
            return;
        }
    
        // Validate amount
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert("Amount must be a positive number.");
            return;
        }
    
        // Prepare the data to be sent to the backend
        const paymentHistoryData = {
            userName: "saraf",
            mobile: "8624975041",
            utrNo: utr,
            beneficiaryName: "sarfa",
            paymentType: transactionType, // Either 'Bank Transfer' or 'UPI'
            dateTime: new Date().toISOString(), // Send the date as a string in ISO format
            amount: Number(amount), // Ensure amount is passed as a number
            screenshot: 'screenshot', // Provide the actual screenshot path or filename
            status: "Pending",
            transactionId:transactionId // Default status
        };
    
        try {
            // Step 1: Save payment history
            const response = await axios.post('/api/payment-history', paymentHistoryData);
            const paymentHistoryId = response.data.data._id; // Assuming the response returns the saved payment history with an _id
            alert('Payment history added successfully!');
          
            // Step 2: Check if the refId and amount exist in the message collection
            // Ensure amount is sent as a string because MongoDB stores amount as a string in your schema
            const messageCheckResponse = await axios.get(`/api/messages?referenceId=${utr}&amount=${Number(amount)}`);
            await new Promise(resolve => setTimeout(resolve, 1000));  // Wait for 1 second
            
           
            if (messageCheckResponse.data.found) {
                console.log(paymentHistoryId);
                // Step 3: If found, update the payment history status to "Approved"
                await axios.put(`/api/payment-history/${paymentHistoryId}`, {
                    status: "Approved"
                  });
                  
                  
                alert('Payment history updated to Approved!');
            } else {
                alert('No matching message found for the payment history.');
            }
           
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Axios-specific error handling
                if (error.response) {
                    console.error('Server error:', error.response.data);
                    alert(`Error: ${error.response.data.message}`);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                    alert('No response received from server.');
                } else {
                    console.error('Axios error:', error.message);
                    alert('An error occurred while adding payment history.');
                }
            } else {
                console.error('Unexpected error:', error);
                alert('An unexpected error occurred.');
            }
        }finally {
            // This will execute in both success and failure cases
            window.location.reload();
          }
    };
    
    
    

    const renderContent = () => {
        switch (activeContent) {
            case "qr/upi pay":
                return (
                    <div>
                        <div className="flex justify-center items-center mt-10">
                        <img
  src={upiId.qrCode && upiId.qrCode.trim() ? upiId.qrCode : "/qr123.jpg"}
  alt="QR Code"
  className="w-100 h-100 md:w-40 md:h-40 object-cover"
/>


                        </div>

                        <div className="flex flex-col gap-4 mt-10">



                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl"> 
                                <Input
                                type="text"
                                label="Beneficiary Name"
                                value={upiId.beneficiaryName} // Pass the correct field from upiDetails state
                                className="w-full text-right text-xl bg-transparent rounded-xl"
                                readOnly
                                style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                            />

                                    <button
                                        onClick={() => handleCopy(upiId.beneficiaryName)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy UPI ID"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl">
                                
                              
                                <Input
                                type="text"
                                label="UPI"
                                value={upiId.upiId} // Pass the correct field from upiDetails state
                                className="w-full text-right text-xl bg-transparent rounded-xl"
                                readOnly
                                style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                            />

                                    <button
                                        onClick={() => handleCopy(upiId.upiId)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy UPI ID"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="Enter Transaction refence number (UTR)"
                                    value={utr}
                                    onChange={handleUtrChange}
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                onClick={() => handleSubmit('UPI')}
                                className="py-4 px-4 w-full bg-greenSubmit rounded-lg"
                                disabled={timeRemaining === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                );
            case "bank transfer":
                return (
                    <div>
                        <div className="flex flex-col gap-4 mt-10">
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl">
                                    <Input
                                        type="text"
                                        label="Name"
                                        value={bankDetails.name}
                                        className="w-full text-right text-xl bg-transparent rounded-xl"
                                        readOnly
                                        style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                                    />
                                    <button
                                        onClick={() => handleCopy(bankDetails.name)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy Name"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl">
                                    <Input
                                        type="text"
                                        label="Account No"
                                        value={bankDetails.accountNo}
                                        className="w-full text-right text-xl bg-transparent rounded-xl"
                                        readOnly
                                        style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                                    />
                                    <button
                                        onClick={() => handleCopy(bankDetails.accountNo)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy Account No"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl">
                                    <Input
                                        type="text"
                                        label="IFSC Code"
                                        value={bankDetails.ifsc}
                                        className="w-full text-right text-xl bg-transparent rounded-xl"
                                        readOnly
                                        style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                                    />
                                    <button
                                        onClick={() => handleCopy(bankDetails.ifsc)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy IFSC Code"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 relative">
                                <div className="w-full relative bg-gray-200 border border-black rounded-xl">
                                    <Input
                                        type="text"
                                        label="Bank Name"
                                        value={bankDetails.bankName}
                                        className="w-full text-right text-xl bg-transparent rounded-xl"
                                        readOnly
                                        style={{ fontWeight: "bold", fontSize: "1.1rem" }}
                                    />
                                    <button
                                        onClick={() => handleCopy(bankDetails.bankName)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-700"
                                        aria-label="Copy Bank Name"
                                    >
                                        <FiCopy className="text-lg" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-20">
                            <Input
                                type="text"
                                label="Enter Transaction reference number (UTR)"
                                value={utr}
                                onChange={handleUtrChange}
                                className="bg-white border-1 border-black rounded-xl"
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                onClick={() => handleSubmit('Bank Transafer')}
                                className="py-4 px-4 w-full bg-greenSubmit rounded-lg"
                                disabled={timeRemaining === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full h-full gap-10 px-10 py-10">
            {/* Left Section (Forms) */}
            <div className="w-full md:w-1/2 p-4 md:p-8 bg-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Amount (Rs)"
                        min="0"
                        className="text-greenText text-base md:text-xl lg:text-xl font-bold w-full md:w-3/4 lg:w-1/2 bg-white border border-black rounded-xl px-4 py-2 placeholder-greenText"
                    />
                    <h2 className="text-xs md:text-sm text-black font-bold text-center">
                        Time Remaining: <span className="text-red-600 text-xl md:text-2xl">{timeRemaining}</span>
                    </h2>
                </div>

                {/* Buttons to toggle content */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
                    <button
                        onClick={() => setActiveContent("qr/upi pay")}
                        className={`py-2 md:py-4 px-4 w-full rounded-xl border-1 border-black ${activeContent === "qr/upi pay"
                            ? "bg-primary text-black font-bold"
                            : "bg-white text-gray-500"
                            }`}
                    >
                        QR/UPI Pay
                    </button>
                    <button
                        onClick={() => setActiveContent("bank transfer")}
                        className={`py-2 md:py-4 px-4 w-full rounded-xl border-1 border-black ${activeContent === "bank transfer"
                            ? "bg-primary text-black font-bold"
                            : "bg-white text-gray-500"
                            }`}
                    >
                        Bank Transfer
                    </button>
                </div>

                <div className="mt-4">{renderContent()}</div>
            </div>

            {/* Right Section (Image) */}
            <div className="hidden md:block w-full md:w-1/2">
                <img
                    src="/heroSection.png"
                    alt="Hero Image"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
