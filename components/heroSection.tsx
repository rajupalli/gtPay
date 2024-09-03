"use client";

import { Input } from "@nextui-org/input";
import React, { useEffect, useState } from "react";

export default function HeroSection() {
    const [activeContent, setActiveContent] = useState("qr/upi pay");
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [amount, setAmount] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(timeRemaining - 1);
            }, 1000);

            return () => clearInterval(timer); // Cleanup the interval on component unmount
        }
    }, [timeRemaining]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Ensure the value is a positive number or empty
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    const handleSubmit = () => {
        if (!isAuthenticated) {
            setShowAlert(true);
            return;
        }
    };

    const renderContent = () => {
        switch (activeContent) {
            case "qr/upi pay":
                return (
                    <div>
                        <div className="flex justify-center items-center mt-10">
                            <img
                                src="/qrcode.png"
                                alt="QR Code"
                                className="w-100 h-100 md:w-40 md:h-40 object-cover"
                            />
                        </div>

                        <div className="flex flex-col gap-4 mt-10">
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="UPI"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="Enter Transaction refence number (UTR)"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="mt-12">
                            <button
                                type="submit"
                                onClick={handleSubmit}
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
                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="name"
                                    label="Name"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="Account No"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="IFSC Code"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>

                            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                                <Input
                                    type="text"
                                    label="Bank Name"
                                    className="bg-white border-1 border-black rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mt-20">
                            <Input
                                type="text"
                                label="Enter Transaction refence number (UTR)"
                                className="bg-white border-1 border-black rounded-xl"
                            />
                        </div>

                        <div className="mt-8">
                            <button
                                type="submit"
                                onClick={handleSubmit}
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

                {showAlert && (
                    <div className="bg-red-500 text-white px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Please log in!</strong>
                        <span className="block sm:inline"> You need to be logged in to submit the form.</span>
                        <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setShowAlert(false)}
                        >
                            <svg
                                className="fill-current h-6 w-6 text-white"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path d="M14.348 5.652a1 1 0 010 1.415L11.415 10l2.933 2.933a1 1 0 11-1.415 1.415L10 11.415l-2.933 2.933a1 1 0 11-1.415-1.415L8.585 10 5.652 7.067a1 1 0 011.415-1.415L10 8.585l2.933-2.933a1 1 0 011.415 0z" />
                            </svg>
                        </span>
                    </div>
                )}

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
