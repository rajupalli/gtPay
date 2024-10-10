"use client"; // Client component directive

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import HeroSection from "@/components/heroSection";
import { Navbar } from "@/components/navbar";

export default function Home() {
  // Extract parameters from the URL
  const { clientId, mobileNumber } = useParams();

  // Ensure clientId and mobileNumber are strings (handle if they are arrays)
  const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId;
  const mobileNumberString = Array.isArray(mobileNumber) ? mobileNumber[0] : mobileNumber;

  // State for transaction ID
  const [transactionId, setTransactionId] = useState<string>('');  // Explicit type for state

  useEffect(() => {
    // Function to generate a 12-digit transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now().toString().slice(-8); // Last 8 digits of the timestamp
      const randomDigits = Math.floor(10000 + Math.random() * 90000).toString(); // Random 5 digits
      return `${timestamp}${randomDigits}`; // Concatenating with template literals for clarity
    };

    // Generate and set the transaction ID
    const id = generateTransactionId();
    setTransactionId(id);
  }, []);

  return (
    <div>
      <Navbar transactionId={transactionId} />
      <HeroSection transactionId={transactionId} mobileNumber={mobileNumberString} clientId={clientIdString} />
    </div>
  );
}
