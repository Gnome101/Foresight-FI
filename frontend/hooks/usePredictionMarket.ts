// frontend/hooks/usePredictionMarket.ts
import { useState, useEffect, useCallback } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { toast } from "sonner";
import { mock_usdc, mock_abi } from "@/abi/mock_erc";
import { mint_address, mint_abi } from "@/abi/dynamic_mint";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { useAppKitAccount } from "@reown/appkit/react";

export function usePredictionMarket() {
  const { address } = useAppKitAccount();
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [yesPrice, setYesPrice] = useState("0");
  const [noPrice, setNoPrice] = useState("0");

  const { writeContract, isPending } = useWriteContract();

  // Create a simple key for the poolKey structure required by the contracts
  // This is a simplified version - in a real app you'd get this from the contract
  const poolKey = {
    currency0: "0x0000000000000000000000000000000000000000",
    currency1: "0x0000000000000000000000000000000000000000",
    fee: 500n, // 0.05%
    tickSpacing: 10n,
    hooks: hook_address,
  };

  // Read USDC balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "balanceOf",
    args: [address || "0x0000000000000000000000000000000000000000"],
    enabled: !!address,
  });

  // Read YES price
  const { data: yesPriceData, refetch: refetchYesPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getYESPrice",
    args: [poolKey],
  });

  // Read NO price
  const { data: noPriceData, refetch: refetchNoPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getNOPrice",
    args: [poolKey],
  });

  // Update state when data changes
  useEffect(() => {
    if (balanceData) {
      setUsdcBalance(formatEther(balanceData));
    }
    if (yesPriceData) {
      setYesPrice(formatEther(yesPriceData));
    }
    if (noPriceData) {
      setNoPrice(formatEther(noPriceData));
    }
  }, [balanceData, yesPriceData, noPriceData]);

  // Mint USDC tokens
  const mintUSDC = useCallback(
    (amount: string) => {
      if (!address) return;

      try {
        const amountBigInt = parseEther(amount);
        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "mint",
          args: [address, amountBigInt],
        });

        // Refetch balance after a short delay to allow transaction to be processed
        setTimeout(() => {
          refetchBalance();
        }, 2000);
      } catch (err) {
        console.error("Error minting USDC:", err);
        toast.error("Failed to mint USDC");
      }
    },
    [address, writeContract, refetchBalance]
  );

  // Deposit USDC and mint prediction tokens
  const depositAndMint = useCallback(
    (amount: string) => {
      if (!address) return;

      try {
        const amountBigInt = parseEther(amount);

        // First approve the minter contract to spend our USDC
        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "approve",
          args: [mint_address, amountBigInt],
        });

        // Then call the deposit and mint function
        setTimeout(() => {
          writeContract({
            address: mint_address,
            abi: mint_abi,
            functionName: "depositAndMint",
            args: [amountBigInt, poolKey],
          });

          // Refetch data after a short delay
          setTimeout(() => {
            refetchBalance();
            refetchYesPrice();
            refetchNoPrice();
          }, 2000);
        }, 2000);
      } catch (err) {
        console.error("Error depositing and minting:", err);
        toast.error("Failed to deposit and mint");
      }
    },
    [
      address,
      writeContract,
      refetchBalance,
      refetchYesPrice,
      refetchNoPrice,
      poolKey,
    ]
  );

  return {
    usdcBalance,
    yesPrice,
    noPrice,
    mintUSDC,
    depositAndMint,
    isLoading: isPending,
  };
}
