"use client";

import HeroSection from "@/components/heroSection";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

interface HomePageProps {
  clientId: string;
  mobileNumber: string;
}

export default function HomePage({ clientId, mobileNumber }: HomePageProps) {
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
      <HeroSection transactionId={transactionId} mobileNumber={mobileNumber} clientId={clientId} />
    </div>
  );
}
