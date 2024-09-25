"use client";

import HeroSection from "@/components/heroSection";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [transactionId, setTransactionId] = useState('');


  useEffect(() => {
    // Function to generate a 12-digit transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of the current timestamp
      const randomDigits = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6 digits
      return timestamp + randomDigits;
    };

    // Generate and set the transaction ID
    const id = generateTransactionId();
    setTransactionId(id);
  }, []);

  return (
    <div>
      <Navbar transactionId={transactionId} />
      <HeroSection transactionId={transactionId} />
    </div>
  );
}
