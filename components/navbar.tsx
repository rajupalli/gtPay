import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import Image from "next/image";
import { useState } from "react";

interface NavbarProps {
  showTransactionId?: boolean;
  transactionId?: string;
   // Add a prop to control the visibility of the logout button
}

export const Navbar: React.FC<NavbarProps> = ({
  showTransactionId = true,
  transactionId,
 
}) => {
  const [selectedClient, setSelectedClient] = useState("client1"); // State to manage the selected client

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
  };

  const handleLogout = () => {
    // Implement your logout logic here (e.g., clear session, redirect to login, etc.)
    console.log("User logged out");
  };

  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      className="shadow-md p-0 m-0 w-full h-auto flex items-center justify-between"
      style={{ padding: 0, margin: 0 }}
    >
      {/* Flexbox container for navbar content */}
      <div className="flex items-center p-0 m-0" style={{ flexShrink: 0 }}>
        <NextLink href="/" className="flex items-center p-0 m-0">
          <Image
            src="/logo.png" // Replace with actual logo path
            alt="OTPay Logo"
            width={150}
            height={150}
            className="object-contain p-0 m-0"
            style={{ paddingLeft: 0, marginLeft: 0 }}
          />
        </NextLink>
      </div>

      <div className="flex-grow"></div>

      {/* Conditionally render the transactionId if showTransactionId is true */}
      {showTransactionId && transactionId && (
        <div className="hidden sm:flex justify-end p-0 m-0">
          <NavbarItem className="hidden md:flex gap-3">
            <span className="text-black font-bold">
              Transaction Id: {transactionId}
            </span>
          </NavbarItem>
        </div>
      )}

       

      {/* Mobile menu toggle */}
      <div className="sm:hidden p-0 m-0">
        <NavbarMenuToggle className="text-black" />
      </div>
    </NextUINavbar>
  );
};
