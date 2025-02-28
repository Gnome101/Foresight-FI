// frontend/hooks/usePredictionMarket.ts
import { useCallback, useState, useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { mock_abi, mock_usdc } from "@/abi/mock_erc";
import { mint_abi, mint_address } from "@/abi/dynamic_mint";
import { hook_abi, hook_address } from "@/abi/hook_abi";
import { useAppKitAccount } from "@reown/appkit/react";
import { parseUnits, formatUnits } from "ethers";
import { toast } from "sonner";

// Sample pool key structure - this would come from your contract
const samplePoolKey = {
  currency0: mock_usdc,
  currency1: "0x0000000000000000000000000000000000000000", // Replace with actual currency1
  fee: 500,
  tickSpacing: 10,
  hooks: hook_address,
};

export function usePredictionMarket() {
  const { address, isConnected } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Set up contract write functionality
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read USDC balance
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "balanceOf",
    args: [(address as `0x${string}`) || "0x0"],
    query: {
      enabled: !!address,
    },
  });

  // Read YES token price
  const { data: yesPrice, refetch: refetchYesPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getYESPrice",
    args: [samplePoolKey],
    query: {
      enabled: !!address,
    },
  });

  // Read NO token price
  const { data: noPrice, refetch: refetchNoPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getNOPrice",
    args: [samplePoolKey],
    query: {
      enabled: !!address,
    },
  });

  // Mint USDC tokens
  const mintUSDC = useCallback(
    async (amount: string) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        // Convert amount to the correct format (6 decimals for USDC)
        const parsedAmount = parseUnits(amount, 6);

        console.log("Minting USDC:", {
          address: mock_usdc,
          amount: parsedAmount.toString(),
          recipient: address,
        });

        // Call the mint function on the mock USDC contract
        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "mint",
          args: [address as `0x${string}`, parsedAmount],
        });
      } catch (err) {
        console.error("Error minting USDC:", err);
        toast.error(err instanceof Error ? err.message : "Failed to mint USDC");
      } finally {
        setIsLoading(false);
      }
    },
    [address, writeContract]
  );

  // Deposit USDC and mint YES/NO tokens
  const depositAndMint = useCallback(
    async (amount: string) => {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        // First, approve USDC spending
        const parsedAmount = parseUnits(amount, 6);

        console.log("Approving USDC:", {
          address: mock_usdc,
          spender: mint_address,
          amount: parsedAmount.toString(),
        });

        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "approve",
          args: [mint_address as `0x${string}`, parsedAmount],
        });

        // Note: In a real implementation, we would wait for this transaction to complete
        // before calling depositAndMint. For simplicity, we're skipping that here.

        // Call depositAndMint on the minter contract
        writeContract({
          address: mint_address,
          abi: mint_abi,
          functionName: "depositAndMint",
          args: [parsedAmount, samplePoolKey],
        });
      } catch (err) {
        console.error("Error depositing and minting:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to deposit and mint tokens"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [address, writeContract]
  );

  // Refetch data when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      refetchUsdcBalance();
      refetchYesPrice();
      refetchNoPrice();
      toast.success("Transaction completed successfully");
    }
  }, [isSuccess, refetchUsdcBalance, refetchYesPrice, refetchNoPrice]);

  // Format values for display
  const formattedUsdcBalance = usdcBalance ? formatUnits(usdcBalance, 6) : "0";
  const formattedYesPrice = yesPrice ? formatUnits(yesPrice, 18) : "0.6";
  const formattedNoPrice = noPrice ? formatUnits(noPrice, 18) : "0.4";

  return {
    usdcBalance: formattedUsdcBalance,
    yesPrice: formattedYesPrice,
    noPrice: formattedNoPrice,
    mintUSDC,
    depositAndMint,
    refetchBalances: () => {
      refetchUsdcBalance();
      refetchYesPrice();
      refetchNoPrice();
    },
    isLoading: isLoading || isTxLoading,
    isSuccess,
  };
}
