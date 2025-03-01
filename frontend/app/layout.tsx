// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";
import { DebugPanel } from "@/components/debug-panel";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Foresight-Fi | Prediction Markets",
  description: "Decentralized prediction markets powered by threshold encryption",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <head>
        <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer/build/spline-viewer.js" 
        strategy="beforeInteractive"
      />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ContextProvider cookies={cookies}>
          {/* Navbar appears on every page */}
          <Navbar />
          
          {/* Main content */}
          <div className="relative overflow-x-hidden min-h-screen">
            {children}
          </div>
          
          <Toaster position="top-right" />
          <DebugPanel />
        </ContextProvider>
      </body>
    </html>
  );
}