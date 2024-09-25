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

interface NavbarProps {
  showTransactionId?: boolean; // Add a prop to control the visibility of the transaction ID
  transactionId?: string; // Transaction ID if it needs to be displayed
}

export const Navbar: React.FC<NavbarProps> = ({ showTransactionId = true, transactionId }) => {
  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="shadow-md">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Image
              src="/logo.png"
              alt="ACME Logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      {/* Conditionally render the transactionId if showTransactionId is true */}
      {showTransactionId && transactionId && (
        <NavbarContent className="hidden sm:flex basis-1/5 sm:basis-full" justify="end">
          <NavbarItem className="hidden md:flex gap-3">
            <span className="text-black font-bold">Transaction Id: {transactionId}</span>
          </NavbarItem>
        </NavbarContent>
      )}

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <NavbarMenuToggle className="text-black" />
      </NavbarContent>

      <NavbarMenu>
        {/* Conditionally render the transactionId in the mobile menu as well */}
        {showTransactionId && transactionId && (
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <span className="text-black font-bold">Transaction Id: {transactionId}</span>
          </div>
        )}
      </NavbarMenu>
    </NextUINavbar>
  );
};
