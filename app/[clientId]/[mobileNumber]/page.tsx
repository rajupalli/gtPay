"use client"; // Client component directive


import HomePage from "../../home/page";
import SignIn from "../../sign-in/page";
import { useParams } from 'next/navigation';

export default function Home() {
  const { clientId, mobileNumber } = useParams();

  // Ensure clientId and mobileNumber are strings (handle if they are arrays)
  const clientIdString = Array.isArray(clientId) ? clientId[0] : clientId;
  const mobileNumberString = Array.isArray(mobileNumber) ? mobileNumber[0] : mobileNumber;

  return (
    <section>
      {/* Pass the string values to HomePage */}
      <HomePage clientId={clientIdString} mobileNumber={mobileNumberString} />
    </section>
  );
}
