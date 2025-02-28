// frontend/app/market-summary/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useAppKitAccount } from '@reown/appkit/react';
import { useMarketCreation } from '@/hooks/useMarketCreation';
import { useEncryption } from '@/hooks/useEncryption';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Common private key for testing
  const COMMON_PRIVATE_KEY = 
    "17198111189740987207522258066070924659068354664866153349209472785674371270060091762895376871405096450964189332505989014717404517835761512453664757667426820217481440982146617209935641204979498323812441179740390809704275764217718676871508299641960392693502986024702569368107809778413850853826168369425962712173790018017361397615845706791905366069526727215230586745271719003886933530843871633556938220645881606394868643579850622075915590012962791258951480013534977101779599471939324439360030244729834387834027239088977696746477158659363343219175191100820364097049332480659184824130271435766049092620682590274475536856966"
  ;
export default function MarketSummaryPage() {
  const { isConnected } = useAppKitAccount();
  const { 
    currentMarket, 
    submitKey, 
    addCommonPublicKey,
    // chooseWinner, 
    refetchMarket, 
    isLoading: marketLoading 
  } = useMarketCreation();
  
  const { 
    sendEncryptedVote, 
    submitDecryptionShare, decryptVotes,
    isLoading: encryptionLoading 
  } = useEncryption();
  
  const [publicKey, setPublicKey] = useState('');
  const [vote, setVote] = useState<'yes' | 'no'>('yes');
  const [customDecryptShare, setCustomDecryptShare] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('keys');

  const isLoading = marketLoading || encryptionLoading;
  
  // Refresh market data when component mounts and periodically
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

  // Handlers for key management
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
      submitKey(publicKey),
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
      addCommonPublicKey(),
      {
        loading: 'Adding common key...',
        success: 'Common key submission transaction sent!',
        error: 'Failed to add common key'
      }
    );
  };

  // Handlers for voting and decryption
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
      sendEncryptedVote(vote, [...currentMarket.publicKeys]),
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
      submitDecryptionShare(customDecryptShare),
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
      submitDecryptionShare(COMMON_PRIVATE_KEY),
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
    
    toast.promise(
      decryptVotes(),
      {
        loading: 'Finalizing market...',
        success: 'Market finalization transaction sent!',
        error: 'Failed to finalize market'
      }
    );
  };

  // Format date for display
  const formatDate = (timestamp: number | bigint) => {
    // Convert BigInt to number if needed
    let numericTimestamp = typeof timestamp === 'bigint' ? Number(timestamp) : timestamp;
    
    // Convert from seconds to milliseconds if the timestamp appears to be in seconds
    // (blockchain timestamps are typically in seconds, not milliseconds)
    if (numericTimestamp < 4102444800) { // timestamp before year 2100
      numericTimestamp *= 1000;
    }
    
    return new Date(numericTimestamp).toLocaleString();
  };

  // Derived state
  const hasKeys = currentMarket?.publicKeys && currentMarket.publicKeys.length > 0;
  const isKeyRegistrationOpen = currentMarket && Date.now()/1000 < Number(currentMarket.keyRegistrationExpiration);
  console.log('isKeyRegistrationOpen', isKeyRegistrationOpen);
  const isMarketExpired = currentMarket && Date.now()/1000 > Number(currentMarket.expiration);
  // console.log(currentMarket,Date.now(),currentMarket.keyRegistrationExpiration, );
  // console.log(Date.now())
  // console.log('isMarketExpired', isMarketExpired);

  // Toggle showing technical details
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

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
                    {true /*currentMarket.isFinalized
                      ? `Finalized (Winner: ${currentMarket.winner ? 'YES' : 'NO'})`
                      : isMarketExpired
                        ? 'Expired (Awaiting finalization)'
                        : 'Active'*/}
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <Label className="font-semibold">Registered Keys:</Label>
                    <p className="mt-1">{currentMarket.publicKeys?.length || 0}</p>
                  </div>
                  
                  <div>
                    <Label className="font-semibold">Decryption Shares:</Label>
                    <p className="mt-1">{currentMarket.partialDecripts?.length || 0}</p>
                  </div>
                </div>

                <Button 
                  onClick={toggleDetails} 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                >
                  {showDetails ? "Hide Technical Details" : "Show Technical Details"}
                </Button>
                      
                {showDetails && (
                  <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md">
                    <div>
                      <Label className="font-semibold">Public Keys:</Label>
                      <div className="mt-1 max-h-32 overflow-y-auto text-xs">
                        {currentMarket.publicKeys && currentMarket.publicKeys.length > 0 ? (
                          currentMarket.publicKeys.map((key, index) => (
                            <div key={index} className="mb-2 p-2 bg-white rounded border">
                              <span className="font-mono break-all">{key.substring(0, 32)}...</span>
                            </div>
                          ))
                        ) : (
                          <p>No public keys registered</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Decryption Shares:</Label>
                      <div className="mt-1 max-h-32 overflow-y-auto text-xs">
                        {currentMarket.partialDecripts && currentMarket.partialDecripts.length > 0 ? (
                          currentMarket.partialDecripts.map((share, index) => (
                            <div key={index} className="mb-2 p-2 bg-white rounded border">
                              <span className="font-mono break-all">{share.substring(0, 32)}...</span>
                            </div>
                          ))
                        ) : (
                          <p>No decryption shares submitted</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="font-semibold">Vote Ciphertexts:</Label>
                      <div className="mt-1 p-2 bg-white rounded border text-xs">
                        <p className="font-mono break-all">
                          c1: {currentMarket.c1 ? `${currentMarket.c1.toString().substring(0, 32)}...` : "None"}
                        </p>
                        <p className="font-mono break-all">
                          c2: {currentMarket.c2 ? `${currentMarket.c2.toString().substring(0, 32)}...` : "None"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Tabs for Key Registration and Decryption Shares */}
            {/*!currentMarket.isFinalized &&*/ (
              <Card>
                <CardHeader>
                  <CardTitle>Market Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="keys">Register Keys</TabsTrigger>
                      <TabsTrigger value="decrypt">Decrypt Shares</TabsTrigger>
                    </TabsList>
                    
                    {/* Key Registration Tab */}
                    <TabsContent value="keys" className="space-y-4">
                      {isKeyRegistrationOpen ? (
                        <>
                          <CardDescription>
                            Register a public key to participate in the encryption process.
                          </CardDescription>
                          
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
                        </>
                      ) : (
                        <div className="text-center p-4 border rounded-md bg-muted/20">
                          <p>Key registration period has ended.</p>
                          {hasKeys ? (
                            <p className="text-sm text-muted-foreground mt-2">
                              {currentMarket.publicKeys?.length} keys have been registered.
                            </p>
                          ) : (
                            <p className="text-red-500 mt-2">
                              No keys were registered during the registration period.
                            </p>
                          )}
                        </div>
                      )}
                    </TabsContent>
                    
                    {/* Decryption Shares Tab */}
                    <TabsContent value="decrypt" className="space-y-4">
                      {/*isMarketExpired */ true ? (
                        <>
                          <CardDescription>
                            Submit a decryption share to help finalize the market.
                          </CardDescription>
                          
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
                            className="w-full"
                          >
                            Add Custom Decrypt Share
                          </Button>
                          
                          <div className="pt-4">
                            <Button
                              onClick={handleDecryptVotes}
                              disabled={isLoading || !isConnected || (currentMarket.partialDecripts?.length || 0) === 0}
                              className="w-full"
                              variant="default"
                            >
                              Finalize Market Results
                            </Button>
                            
                            {(currentMarket.partialDecripts?.length || 0) === 0 && (
                              <p className="text-amber-600 text-sm mt-2 text-center">
                                At least one decryption share is required to finalize the market.
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 border rounded-md bg-muted/20">
                          <p>Decryption shares can only be submitted after the market has expired.</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            The market will expire on {formatDate(currentMarket.expiration)}.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            {/* Voting Section */}
            {/*!isKeyRegistrationOpen && !isMarketExpired && !currentMarket.isFinalized &&*/ (
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
                    disabled={isLoading || !isConnected || !hasKeys}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send Encrypted Vote'}
                  </Button>
                  
                  {!hasKeys && (
                    <p className="text-red-500 text-sm text-center">
                      No keys registered. Voting is not possible.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Results display if finalized */}
            {currentMarket.isFinalized && (
              <Card>
                <CardHeader>
                  <CardTitle>Market Results</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`p-6 rounded-lg ${currentMarket.winner ? 'bg-green-100' : 'bg-red-100'}`}>
                    <h3 className="text-2xl font-bold mb-2">
                      Winner: {currentMarket.winner ? "YES" :"NO" }
                    </h3>
                    <p className="text-gray-700">The market has been finalized and the results are available.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Debug panel */}
            <Card>
              <CardHeader>
                <CardTitle>Debug Panel</CardTitle>
                <CardDescription>
                  Use this panel to force refresh market data and check the state
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => refetchMarket()} 
                  variant="outline" 
                  className="w-full"
                >
                  Force Refresh Market Data
                </Button>
                
                <div className="text-xs space-y-2 p-2 bg-gray-50 rounded">
                  <p><strong>Current Timestamp:</strong> {Date.now()}</p>
                  <p><strong>Registration End:</strong> {currentMarket.keyRegistrationExpiration}</p>
                  <p><strong>Market End:</strong> {currentMarket.expiration}</p>
                  <p><strong>Keys Count:</strong> {currentMarket.publicKeys?.length || 0}</p>
                  <p><strong>Decrypts Count:</strong> {currentMarket.partialDecripts?.length || 0}</p>
                  <p><strong>Registration Open:</strong> {isKeyRegistrationOpen ? "Yes" : "No"}</p>
                  <p><strong>Market Expired:</strong> {isMarketExpired ? "Yes" : "No"}</p>
                  <p><strong>Is Finalized:</strong> {currentMarket.isFinalized ? "Yes" : "No"}</p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}