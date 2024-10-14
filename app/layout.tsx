"use client"

import "@/styles/globals.css";
// import { Metadata, Viewport } from "next";
// import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";

// import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
} from '@clerk/nextjs'

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   description: siteConfig.description,
//   icons: {
//     icon: "/favicon.ico",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = /^\/dashboard\/[^\/]+$/.test(pathname);

  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <head />
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
              {isDashboard && <Sidebar />}
              <main className="container mx-auto max-w-full flex-grow">
                {children}
              </main>
              <footer className="w-full flex items-center justify-center">

              </footer>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
