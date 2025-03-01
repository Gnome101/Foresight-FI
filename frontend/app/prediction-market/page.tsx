'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { useAppKitAccount } from '@reown/appkit/react';
import { usePredictionMarket } from '@/hooks/usePredictionMarket';
import { Sparkles } from 'lucide-react';
import SplineEyeball from '@/components/spline-eyeball';


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
  const [balanceNo, setBalanceNo] = useState(10); 
  const [balanceYes, setBalanceYes] = useState(5);

  const handleMintUSDC = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          mintUSDC(mintAmount);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Conjuring USDC...',
        success: 'USDC appeared in your wallet!',
        error: 'The spell failed to mint USDC'
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
        loading: 'Transmuting tokens...',
        success: 'The prophecy tokens have been created!',
        error: 'The transmutation ritual failed'
      }
    );
  };

  const handleBuyNo = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.info("Preparing to acquire NO tokens - coming soon to your vision");
  };

  const handleBuyYes = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.info("Preparing to acquire YES tokens - coming soon to your vision");
  };

  // Calculate display prices (convert from wei to display format)
  const displayNoPrice = parseFloat(noPrice).toFixed(2);
  const displayYesPrice = parseFloat(yesPrice).toFixed(2);

  // Display formatted USDC balance
  const displayUsdcBalance = parseFloat(usdcBalance).toFixed(2);

 return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-6 relative">
        {/* Mystical decorative elements */}
             

        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl z-0"></div>
           <SplineEyeball />
        {/* Eyeball above the heading */}
        
        <h1 className="text-3xl font-bold text-center text-primary relative z-10">
          Who will win the election?
        </h1>

        {/* Network information banner */}
        <div className="bg-secondary/40 border-l-4 border-primary text-foreground p-4 rounded relative z-10">
          <p className="font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Network Information
          </p>
          <p>This application is connected to Unichain Sepolia. Please make sure your wallet is connected to this network.</p>
        </div>

        {/* Graph placeholder */}
        <div className="w-full h-48 bg-secondary/20 flex items-center justify-center rounded relative z-10 border border-border/50 overflow-hidden backdrop-blur-sm">
          <span className="text-primary/70">Market Trends Visualization</span>
          {/* Decorative elements for the graph */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-accent to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Left side - Buy/Sell */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-primary">Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={handleBuyNo} 
                  disabled={!isConnected || isLoading}
                  className="bg-red-500/80 hover:bg-red-600/80 text-white"
                >
                  Buy No
                </Button>
                <Button 
                  onClick={handleBuyYes} 
                  disabled={!isConnected || isLoading}
                  className="bg-green-500/80 hover:bg-green-600/80 text-white"
                >
                  Buy Yes
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-secondary/30 rounded-md backdrop-blur-sm">
                <p className="flex justify-between">
                  <span>No Price:</span> 
                  <span className="font-semibold text-red-400">${displayNoPrice}</span>
                </p>
                <p className="flex justify-between">
                  <span>Yes Price:</span> 
                  <span className="font-semibold text-green-400">${displayYesPrice}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right side - Wallet & USDC */}
          <Card className="border-border/50 backdrop-blur-sm bg-card/80 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-accent/5"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-primary">Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              {isConnected ? (
                <>
                  <div className="p-4 bg-secondary/30 rounded-md backdrop-blur-sm space-y-2">
                    <div className="flex justify-between">
                      <span>USDC Balance:</span>
                      <span className="font-semibold text-primary">${displayUsdcBalance}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>NO Tokens:</span>
                      <span className="font-semibold text-red-400">{balanceNo}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>YES Tokens:</span>
                      <span className="font-semibold text-green-400">{balanceYes}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="mintAmount" className="text-foreground/90">Mint Amount (USDC)</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="mintAmount"
                        type="number" 
                        value={mintAmount} 
                        onChange={(e) => setMintAmount(e.target.value)}
                        className="w-full bg-secondary/20 border-border/50"
                      />
                      <Button 
                        onClick={handleMintUSDC} 
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isLoading ? 'Conjuring...' : 'Mint USDC'}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="depositAmount" className="text-foreground/90">Deposit Amount (USDC)</Label>
                    <Input 
                      id="depositAmount"
                      type="number" 
                      value={depositAmount} 
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full bg-secondary/20 border-border/50"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleRedeemTokens} 
                    className="w-full mt-4 bg-accent hover:bg-accent/90"
                    disabled={isLoading}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Transmute Into Prophecy Tokens
                  </Button>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Connect your wallet to see your fortune</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}