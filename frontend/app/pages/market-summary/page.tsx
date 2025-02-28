/* =========================================================
   pages/market-summary/page.tsx
   Sketch 2: Shows market details, lets user vote, 
   add key, partial decrypt shares, and decrypt votes.
========================================================= */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function MarketSummaryPage() {
  const [vote, setVote] = useState("");
  // Add more state for keys, partial decrypt shares, etc. as needed

  const handleSendVote = () => {
    // TODO: send vote logic
    console.log("Vote sent:", vote);
  };

  const handleAddKey = () => {
    // TODO: add key logic
    console.log("Key added");
  };

  const handleAddPartialDecryptShare = () => {
    // TODO: partial decrypt logic
    console.log("Partial decrypt share added");
  };

  const handleDecryptVotes = () => {
    // TODO: decrypt votes logic
    console.log("Votes decrypted");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Current Market Description:</h1>
          <p className="text-lg">Who will win the election?</p>
        </div>

        <div className="flex flex-col items-start space-y-1">
          <Label htmlFor="eventFinished">Event Finished:</Label>
          {/* In a real implementation, you'd display dynamic data here */}
          <span id="eventFinished" className="text-sm">Not yet</span>
        </div>

        <div className="flex flex-col items-start space-y-1">
          <Label htmlFor="outcome">Outcome:</Label>
          <span id="outcome" className="text-sm">–</span>
        </div>

        <div className="flex flex-col items-start space-y-1">
          <Label htmlFor="expiryDate">Expiry Date:</Label>
          <span id="expiryDate" className="text-sm">–</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vote">Enter Vote:</Label>
          <Input
            id="vote"
            placeholder="Yes or No"
            value={vote}
            onChange={(e) => setVote(e.target.value)}
          />
          <Button onClick={handleSendVote}>Send Vote</Button>
        </div>

        <Button onClick={handleAddKey}>Add Key</Button>
        <Button onClick={handleAddPartialDecryptShare}>
          Add Partial Decrypt Share
        </Button>
        <Button onClick={handleDecryptVotes}>Decrypt Votes</Button>
      </div>
    </div>
  );
}
