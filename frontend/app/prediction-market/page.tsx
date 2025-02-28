// frontend/app/prediction-market/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { useAppKitAccount } from '@reown/appkit/react';
import { usePredictionMarket } from '@/hooks/usePredictionMarket';

export default function PredictionMarketPage() {
  const { address, isConnected } = useAppKitAccount();
  const { 
    usdcBalance, 
    yesPrice, 
    noPrice, 
    mintUSDC, 
    depositAndMint, 
    isLoading
  } = usePredictionMarket();
  
  const [mintAmount, setMintAmount] = useState('100');
  const [depositAmount, setDepositAmount] = useState('10');
  const [balanceNo, setBalanceNo] = useState(10); // Will come from contract later
  const [balanceYes, setBalanceYes] = useState(5); // Will come from contract later

  const handleMintUSDC = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.promise(
      // The promise
      new Promise((resolve, reject) => {
        try {
          mintUSDC(mintAmount);
          // This isn't a real promise resolution since our function doesn't return one,
          // but it helps with the UI feedback
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Minting USDC...',
        success: 'Minting transaction submitted!',
        error: 'Failed to mint USDC'
      }
    );
  };

  const handleRedeemTokens = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          depositAndMint(depositAmount);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Redeeming tokens...',
        success: 'Redemption transaction submitted!',
        error: 'Failed to redeem tokens'
      }
    );
  };

  const handleBuyNo = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.info("Buying NO tokens - functionality coming soon");
  };

  const handleBuyYes = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.info("Buying YES tokens - functionality coming soon");
  };

  // Calculate display prices (convert from wei to display format)
  const displayNoPrice = parseFloat(noPrice).toFixed(2);
  const displayYesPrice = parseFloat(yesPrice).toFixed(2);

  // Display formatted USDC balance
  const displayUsdcBalance = parseFloat(usdcBalance).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Who will win the election?
        </h1>

        {/* Network information banner */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded">
          <p className="font-bold">Network Information</p>
          <p>This application is connected to Base Sepolia. Please make sure your wallet is connected to this network.</p>
        </div>

        {/* Graph placeholder */}
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500">Graph</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Buy/Sell */}
          <Card>
            <CardHeader>
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={handleBuyNo} 
                  disabled={!isConnected || isLoading}
                >
                  Buy No
                </Button>
                <Button 
                  onClick={handleBuyYes} 
                  disabled={!isConnected || isLoading}
                >
                  Buy Yes
                </Button>
              </div>
              
              <div className="mt-4">
                <p>No Price: ${displayNoPrice}</p>
                <p>Yes Price: ${displayYesPrice}</p>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Wallet & USDC */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <>
                  <div className="flex justify-between">
                    <span>USDC Balance:</span>
                    <span className="font-semibold">${displayUsdcBalance}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>NO Tokens:</span>
                    <span className="font-semibold">{balanceNo}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>YES Tokens:</span>
                    <span className="font-semibold">{balanceYes}</span>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="mintAmount">Mint Amount (USDC)</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="mintAmount"
                        type="number" 
                        value={mintAmount} 
                        onChange={(e) => setMintAmount(e.target.value)}
                        className="w-full"
                      />
                      <Button 
                        onClick={handleMintUSDC} 
                        disabled={isLoading}
                      >
                        {isLoading ? 'Minting...' : 'Mint USDC'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="depositAmount">Deposit Amount (USDC)</Label>
                    <Input 
                      id="depositAmount"
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleRedeemTokens} 
                    className="w-full mt-4"
                    disabled={isLoading}
                  >
                    Redeem For Yes/No Tokens
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p>Connect your wallet to view balance and trade</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}