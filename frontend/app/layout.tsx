// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { DebugPanel } from "@/components/debug-panel";

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
          <Toaster position="top-right" />
          <DebugPanel />
        </ContextProvider>
      </body>
    </html>
  );
}