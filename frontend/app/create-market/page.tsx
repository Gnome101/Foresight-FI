/* =========================================================
   pages/create-market/page.tsx
   Sketch 1: No existing market, allow user to create a new one.
========================================================= */

"use client";

import { Button } from "@/components/ui/button"; // or replace with your own button
import { Input } from "@/components/ui/input";   // or your own input
import { Label } from "@/components/ui/label";   // or your own label
import { useState } from "react";

export default function CreateMarketPage() {
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Placeholder for createMarket functionality
  const handleCreateMarket = () => {
    // TODO: Implement the logic to create a market
    console.log("Market created:", { description, expiryDate });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">No Existing Market</h1>

        <div className="space-y-2">
          <Label htmlFor="description">Enter A Description:</Label>
          <Input
            id="description"
            placeholder="e.g. Who will win the election?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiry">Enter An Expiry Date:</Label>
          <Input
            id="expiry"
            placeholder="e.g. 2025-12-31"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <Button
          onClick={handleCreateMarket}
          variant="default"
          className="w-full"
        >
          Create a Market
        </Button>
      </div>
    </div>
  );
}
