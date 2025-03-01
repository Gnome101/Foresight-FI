// frontend/app/create-market/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMarketCreation } from '@/hooks/useMarketCreation';

export default function CreateMarketPage() {
  const { isConnected } = useAppKitAccount();
  const { 
    createMarket, 
    currentMarket, 
    isLoading,
    needsApproval,
    approveUSDC,
    checkApprovalNeeded,
    refetchMarket 
  } = useMarketCreation();
  
  const [description, setDescription] = useState('');
  const [registrationDays, setRegistrationDays] = useState('3');
  const [marketDays, setMarketDays] = useState('30');
  const [initialUSDC, setInitialUSDC] = useState('1000');
  const [startPrice, setStartPrice] = useState('0.5');

  // Refresh market data when component mounts
   useEffect(() => {
    // Initial fetch
    refetchMarket();
    
    // Refresh data every 10 seconds
    const intervalId = setInterval(() => {
      refetchMarket();
    }, 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [refetchMarket]);
  
  useEffect(() => {
    refetchMarket();
  }, [refetchMarket]);
  
  // Update approval check when amounts change
  useEffect(() => {
    if (isConnected) {
      checkApprovalNeeded(initialUSDC);
    }
  }, [initialUSDC, isConnected, checkApprovalNeeded]);

  // Check if there's already an active market
  const hasExistingMarket = currentMarket && !currentMarket.isFinalized && 
    currentMarket.expiration > BigInt(Math.floor(Date.now() / 1000));
    
  const handleApprove = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    approveUSDC();
  };

  const handleCreateMarket = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!description) {
      toast.error("Please enter a market description");
      return;
    }
    
    // Validate price is between 0 and 1
    const priceNum = parseFloat(startPrice);
    if (isNaN(priceNum) || priceNum <= 0 || priceNum >= 1) {
      toast.error("Starting price must be between 0 and 1");
      return;
    }
    
    // If approval is needed, show message
    if (needsApproval) {
      toast.info("Please approve USDC first");
      return;
    }
    
    // Convert days to seconds
    const registrationDelay = parseInt((parseFloat(registrationDays) * 24 * 60 * 60).toString());
    const marketLength = parseInt((parseFloat(marketDays) * 24 * 60 * 60).toString());
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          createMarket(description, registrationDelay, marketLength, initialUSDC, startPrice);
          
          // Set a timeout to allow the transaction to be processed
          // and then refetch the market data
          setTimeout(() => {
            refetchMarket();
            resolve("Market created successfully");
          }, 5000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Creating market...',
        success: 'Market creation transaction submitted!',
        error: 'Failed to create market'
      }
    );
  };

  // Format date for display
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full space-y-8">
        <h1 className="text-2xl font-bold text-center">
          {hasExistingMarket ? 'Current Market' : 'Create New Market'}
        </h1>
        
        {/*hasExistingMarket*/false ? (
          <Card>
            <CardHeader>
              <CardTitle>Existing Market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-semibold">Description:</Label>
                <p className="mt-1">{currentMarket.description}</p>
              </div>
              
              <div>
                <Label className="font-semibold">Key Registration Ends:</Label>
                <p className="mt-1">{formatDate(currentMarket.keyRegistrationExpiration)}</p>
              </div>
              
              <div>
                <Label className="font-semibold">Market Expires:</Label>
                <p className="mt-1">{formatDate(currentMarket.expiration)}</p>
              </div>
              
              <div>
                <Label className="font-semibold">Status:</Label>
                <p className="mt-1">
                  {currentMarket.isFinalized
                    ? `Finalized (Winner: ${currentMarket.winner ? 'YES' : 'NO'})`
                    : 'Active'}
                </p>
              </div>
              
              <div className="pt-4">
                <p className="text-yellow-600">
                  There is already an active market. Please wait for it to expire before creating a new one.
                </p>
              </div>
              
              <Button
                onClick={() => refetchMarket()}
                variant="outline"
                className="w-full"
              >
                Refresh Market Data
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create New Prediction Market</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Market Question:</Label>
                <Input
                  id="description"
                  placeholder="e.g. Will Bitcoin reach $100,000 by the end of 2024?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration">Key Registration Period (days):</Label>
                <Input
                  id="registration"
                  type="number"
                  placeholder="3"
                  value={registrationDays}
                  onChange={(e) => setRegistrationDays(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This is the period during which users can submit encryption keys.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketLength">Market Duration (days):</Label>
                <Input
                  id="marketLength"
                  type="number"
                  placeholder="30"
                  value={marketDays}
                  onChange={(e) => setMarketDays(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  This is how long the market will be active after the key registration period.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="initialUSDC">Initial USDC Liquidity:</Label>
                <Input
                  id="initialUSDC"
                  type="number"
                  placeholder="1000"
                  value={initialUSDC}
                  onChange={(e) => {
                    setInitialUSDC(e.target.value);
                    checkApprovalNeeded(e.target.value);
                  }}
                />
                <p className="text-xs text-gray-500">
                  Amount of USDC to seed the market with (from your wallet).
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startPrice">Starting Price Ratio (0-1):</Label>
                <Input
                  id="startPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="0.99"
                  placeholder="0.5"
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Initial probability of YES (0.5 = 50% chance, balanced pool).
                </p>
              </div>
              {needsApproval ? (
                <Button
                  onClick={handleApprove}
                  disabled={isLoading || !isConnected}
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                >
                  {isLoading ? 'Approving...' : 'Approve USDC'}
                </Button>
              ) : (
                <Button
                  onClick={handleCreateMarket}
                  disabled={isLoading || !isConnected}
                  className="w-full mt-4"
                >
                  {isLoading ? 'Creating...' : 'Create Market'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}