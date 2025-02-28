// frontend/components/debug-panel.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useContractWrite, useContractRead } from 'wagmi';
import { hook_address, hook_abi } from '@/abi/hook_abi';

export function DebugPanel() {
  const [expanded, setExpanded] = useState(false);
  const [customFunctionName, setCustomFunctionName] = useState('');
  const [customArgs, setCustomArgs] = useState('');
  const [lastContractRead, setLastContractRead] = useState<any>(null);

  // Contract read setup
  const { data: marketData, isError: isReadError, error: readError, refetch } = useContractRead({
    address: hook_address,
    abi: hook_abi,
    functionName: 'getMarket',
  });

  // Keys read setup
  const { data: keysData, refetch: refetchKeys } = useContractRead({
    address: hook_address,
    abi: hook_abi,
    functionName: 'getKeys',
  });

  // Decryption shares read setup
  const { data: sharesData, refetch: refetchShares } = useContractRead({
    address: hook_address,
    abi: hook_abi,
    functionName: 'getDecryptionShares',
  });

  // Contract write setup
  const { writeAsync: writeContract, isPending, isError, error } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: customFunctionName as never, // Type assertion to work with dynamic function name
  });

  // Refresh data on component mount
  useEffect(() => {
    if (expanded) {
      refetch();
      refetchKeys();
      refetchShares();
    }
  }, [expanded, refetch, refetchKeys, refetchShares]);

  // Refresh all contract data
  const handleRefreshAll = async () => {
    try {
      await Promise.all([refetch(), refetchKeys(), refetchShares()]);
      
      // Store last read values for display
      setLastContractRead({
        market: marketData,
        keys: keysData,
        shares: sharesData,
      });
      
      toast.success("Contract data refreshed");
    } catch (err) {
      console.error("Error refreshing contract data:", err);
      toast.error("Failed to refresh contract data");
    }
  };

  // Execute custom contract call
  const handleCustomCall = async () => {
    if (!customFunctionName) {
      toast.error("Please enter a function name");
      return;
    }
    
    try {
      // Parse arguments if provided
      const parsedArgs = customArgs ? JSON.parse(customArgs) : [];
      
      // Execute the contract write
      const tx = await writeContract({ args: parsedArgs });
      
      toast.success(`Transaction submitted: ${tx.hash}`);
      
      // Refresh data after a delay
      setTimeout(handleRefreshAll, 5000);
    } catch (err) {
      console.error("Error executing custom call:", err);
      toast.error(`Failed to execute: ${(err as Error).message}`);
    }
  };

  if (!expanded) {
    return (
      <Button 
        onClick={() => setExpanded(true)} 
        variant="outline" 
        size="sm" 
        className="fixed bottom-4 right-4 bg-white"
      >
        Open Debug Panel
      </Button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white shadow-lg border-t border-l p-4 z-50 max-h-screen overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Contract Debug Panel</h3>
        <Button 
          onClick={() => setExpanded(false)} 
          variant="ghost" 
          size="sm"
        >
          Close
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Hook Contract Address:</Label>
          <code className="text-xs block p-2 bg-gray-100 rounded overflow-x-auto">
            {hook_address}
          </code>
        </div>
        
        <Button onClick={handleRefreshAll} variant="outline" size="sm" className="w-full">
          Refresh Contract Data
        </Button>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Custom Contract Call</h4>
          
          <div className="space-y-2 mb-2">
            <Label htmlFor="functionName">Function Name:</Label>
            <Input
              id="functionName"
              placeholder="e.g. submitKey"
              value={customFunctionName}
              onChange={(e) => setCustomFunctionName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2 mb-4">
            <Label htmlFor="args">Arguments (JSON array):</Label>
            <Input
              id="args"
              placeholder='e.g. ["0x1234..."]'
              value={customArgs}
              onChange={(e) => setCustomArgs(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Enter arguments as a JSON array, e.g. ["string arg", 1234]
            </p>
          </div>
          
          <Button 
            onClick={handleCustomCall} 
            disabled={isPending || !customFunctionName}
            size="sm"
            className="w-full"
          >
            {isPending ? 'Executing...' : 'Execute Call'}
          </Button>
          
          {isError && (
            <p className="text-red-500 text-xs mt-2">
              Error: {error?.message}
            </p>
          )}
        </div>
        
        {lastContractRead && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Last Contract Read</h4>
            <div className="max-h-96 overflow-y-auto">
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(lastContractRead, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}