/* =========================================================
   layout.tsx
   Place this at app/layout.tsx (or wherever your root layout is).
   This version includes the Navbar so that it appears on every page.
   Adjust imports and paths as needed for your project.
========================================================= */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Navbar } from "@/components/navbar"; // Adjust path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3 BoilerPlate",
  description: "Web3 Boilerplate for SST v3",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider cookies={cookies}>
          {/* Navbar appears on every page */}
          <Navbar />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
