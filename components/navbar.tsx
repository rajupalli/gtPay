import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import NextLink from "next/link";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";

export const Navbar = () => {
  const { user } = useUser();

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

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex gap-3">
          {user ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "cursor-pointer",
                },
              }}
            />
          ) : (
            <>
              <Button
                as={NextLink}
                href="/sign-up"
                className="text-xl font-semibold text-primary bg-gray-200 rounded-md"
                variant="flat"
              >
                Register
              </Button>
              <Button
                as={NextLink}
                href="/sign-in"
                className="text-xl font-semibold text-whiteSecond bg-primary rounded-md"
                variant="flat"
              >
                Login
              </Button>
            </>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        {user ? (
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "cursor-pointer",
              },
            }}
          />
        ) : (
          <></>
        )}
        <NavbarMenuToggle className="text-black" />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {!user && (
            <>
              <NavbarMenuItem>
                <Button
                  as={NextLink}
                  href="/sign-up"
                  className="text-xl font-semibold text-primary bg-gray-200 rounded-md w-full"
                  variant="flat"
                >
                  Register
                </Button>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Button
                  as={NextLink}
                  href="/sign-in"
                  className="text-xl font-semibold text-whiteSecond bg-primary rounded-md w-full"
                  variant="flat"
                >
                  Login
                </Button>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
