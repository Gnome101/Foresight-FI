// frontend/app/market-summary/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Using existing shadcn components
import { toast } from 'sonner';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMarketCreation } from '@/hooks/useMarketCreation';
import { useEncryption } from '@/hooks/useEncryption';

// Common private key for testing
const COMMON_PRIVATE_KEY = "17198111189740987207522258066070924659068354664866153349209472785674371270060091762895376871405096450964189332505989014717404517835761512453664757667426820217481440982146617209935641204979498323812441179740390809704275764217718676871508299641960392693502986024702569368107809778413850853826168369425962712173790018017361397615845706791905366069526727215230586745271719003886933530843871633556938220645881606394868643579850622075915590012962791258951480013534977101779599471939324439360030244729834387834027239088977696746477158659363343219175191100820364097049332480659184824130271435766049092620682590274475536856966";

export default function MarketSummaryPage() {
  const { isConnected } = useAppKitAccount();
  const { 
    currentMarket, 
    submitKey, 
    useCommonPublicKey,
    chooseWinner, 
    refetchMarket, 
    isLoading: marketLoading
  } = useMarketCreation();
  
  const { 
    sendEncryptedVote, 
    submitDecryptionShare, 
    isLoading: encryptionLoading 
  } = useEncryption();
  
  const [publicKey, setPublicKey] = useState('');
  const [vote, setVote] = useState<'yes' | 'no'>('yes');
  const [customDecryptShare, setCustomDecryptShare] = useState('');

  const isLoading = marketLoading || encryptionLoading;

  // Refresh market data when component mounts
  useEffect(() => {
    refetchMarket();
  }, [refetchMarket]);

  const handleAddKey = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!publicKey) {
      toast.error("Please enter a public key");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          submitKey(publicKey);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Adding key...',
        success: 'Key submission transaction sent!',
        error: 'Failed to add key'
      }
    );
  };

  const handleUseCommonKey = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          useCommonPublicKey();
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Adding common key...',
        success: 'Common key submission transaction sent!',
        error: 'Failed to add common key'
      }
    );
  };

  const handleSendVote = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!currentMarket?.publicKeys || currentMarket.publicKeys.length === 0) {
      toast.error("No public keys registered for encryption");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          sendEncryptedVote(vote, currentMarket.publicKeys);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Encrypting and sending vote...',
        success: 'Vote submitted!',
        error: 'Failed to send vote'
      }
    );
  };

  const handleAddCustomDecryptShare = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!customDecryptShare) {
      toast.error("Please enter a decryption share");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          submitDecryptionShare(customDecryptShare);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Submitting custom decrypt share...',
        success: 'Decrypt share submission transaction sent!',
        error: 'Failed to submit decrypt share'
      }
    );
  };

  const handleUseCommonDecryptShare = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          submitDecryptionShare(COMMON_PRIVATE_KEY);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Generating and submitting decrypt share...',
        success: 'Common decrypt share submitted!',
        error: 'Failed to submit decrypt share'
      }
    );
  };

  const handleDecryptVotes = () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    // Default to YES winner for simplicity - you would implement actual logic here
    const isYesWinner = true;
    
    toast.promise(
      new Promise((resolve, reject) => {
        try {
          chooseWinner(isYesWinner);
          setTimeout(resolve, 1000);
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: 'Finalizing market...',
        success: 'Market finalization transaction sent!',
        error: 'Failed to finalize market'
      }
    );
  };

  // Format date for display
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  // Check if key registration is still open
  const isKeyRegistrationOpen = currentMarket && 
    Date.now() < currentMarket.keyRegistrationExpiration;

  // Check if market has expired
  const isMarketExpired = currentMarket && 
    Date.now() > currentMarket.expiration;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full space-y-6">
        {!currentMarket ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center">No active market found. Please create a market first.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Market Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-semibold">Market Question:</Label>
                  <p className="mt-1">{currentMarket.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Key Registration Until:</Label>
                    <p className="mt-1">{formatDate(currentMarket.keyRegistrationExpiration)}</p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Market Expires On:</Label>
                    <p className="mt-1">{formatDate(currentMarket.expiration)}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="font-semibold">Status:</Label>
                  <p className="mt-1">
                    {currentMarket.isFinalized
                      ? `Finalized (Winner: ${currentMarket.winner ? 'YES' : 'NO'})`
                      : isMarketExpired
                        ? 'Expired (Awaiting finalization)'
                        : 'Active'}
                  </p>
                </div>
                
                <div>
                  <Label className="font-semibold">Registered Keys:</Label>
                  <p className="mt-1">{currentMarket.publicKeys?.length || 0}</p>
                </div>
                
                <div>
                  <Label className="font-semibold">Decryption Shares:</Label>
                  <p className="mt-1">{currentMarket.partialDecripts?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
            
            {isKeyRegistrationOpen && (
              <Card>
                <CardHeader>
                  <CardTitle>Register Public Key</CardTitle>
                  <CardDescription>
                    You can either use the common key for testing or provide your own key.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleUseCommonKey}
                    disabled={isLoading || !isConnected}
                    className="w-full"
                    variant="secondary"
                  >
                    Use Common Public Key
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="publicKey">Your Public Key:</Label>
                    <Input
                      id="publicKey"
                      placeholder="Enter your public key"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddKey}
                    disabled={isLoading || !isConnected || !publicKey}
                    className="w-full"
                  >
                    {isLoading ? 'Adding...' : 'Add Custom Key'}
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {!isKeyRegistrationOpen && !isMarketExpired && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Vote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Your Vote:</Label>
                    <RadioGroup 
                      value={vote} 
                      onValueChange={(v) => setVote(v as 'yes' | 'no')}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button
                    onClick={handleSendVote}
                    disabled={isLoading || !isConnected}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send Encrypted Vote'}
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {isMarketExpired && !currentMarket.isFinalized && (
              <Card>
                <CardHeader>
                  <CardTitle>Finalize Market</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={handleUseCommonDecryptShare}
                    disabled={isLoading || !isConnected}
                    className="w-full"
                    variant="secondary"
                  >
                    Use Common Decryption Key
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customDecryptShare">Custom Decryption Share:</Label>
                    <Input
                      id="customDecryptShare"
                      placeholder="Enter your decryption share"
                      value={customDecryptShare}
                      onChange={(e) => setCustomDecryptShare(e.target.value)}
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddCustomDecryptShare}
                    disabled={isLoading || !isConnected || !customDecryptShare}
                  >
                    Add Custom Decrypt Share
                  </Button>
                  
                  <div className="pt-4">
                    <Button
                      onClick={handleDecryptVotes}
                      disabled={isLoading || !isConnected || currentMarket.partialDecripts?.length === 0}
                      className="w-full"
                    >
                      Finalize Market Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}