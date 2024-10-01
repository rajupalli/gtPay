"use client";

import HeroSection from "@/components/heroSection";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";


export default function HomePage() {
  const [transactionId, setTransactionId] = useState('');


  useEffect(() => {
    // Function to generate a 12-digit transaction ID
    const generateTransactionId = () => {
      const timestamp = Date.now().toString().slice(-8); // Take the last 8 digits of the timestamp
      const randomDigits = Math.floor(10000 + Math.random() * 90000).toString(); // Random 5 digits
      return timestamp + randomDigits; // Concatenate the timestamp and random digits
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
