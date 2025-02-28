/* =========================================================
   pages/prediction-market/page.tsx
   Sketch 3: Shows the current market, a graph (placeholder),
   allows minting USDC, redeeming for YES/NO tokens,
   shows balances, and buy/sell prices.
========================================================= */

"use client";

import { Button } from "@/components/ui/button";

export default function PredictionMarketPage() {
  // Example states. Replace or expand as needed.
  // In real code you might fetch these from a smart contract or use context.
  const noPrice = 0.4;
  const yesPrice = 0.6;
  const balanceNo = 10;
  const balanceYes = 5;

  const handleMintUSDC = () => {
    // TODO: mint logic
    console.log("Minting USDC...");
  };

  const handleRedeemTokens = () => {
    // TODO: redeem logic
    console.log("Redeeming for YES/NO tokens...");
  };

  const handleBuyNo = () => {
    // TODO: buy No logic
    console.log("Buying NO tokens...");
  };

  const handleBuyYes = () => {
    // TODO: buy Yes logic
    console.log("Buying YES tokens...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Who will win the election?
        </h1>

        {/* Graph placeholder */}
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500">Graph</span>
        </div>

        {/* Buy Buttons */}
        <div className="flex space-x-4 justify-center">
          <Button onClick={handleBuyNo}>Buy No</Button>
          <Button onClick={handleBuyYes}>Buy Yes</Button>
        </div>

        {/* Right side controls */}
        <div className="flex flex-col items-start space-y-2">
          <Button onClick={handleMintUSDC}>Mint Test USDC</Button>
          <Button onClick={handleRedeemTokens}>Redeem For Yes/No Tokens</Button>

          <p>No Price: {noPrice}</p>
          <p>Yes Price: {yesPrice}</p>
          <p>Balance No: {balanceNo}</p>
          <p>Balance Yes: {balanceYes}</p>
        </div>
      </div>
    </div>
  );
}
