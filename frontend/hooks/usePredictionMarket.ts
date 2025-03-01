// frontend/hooks/usePredictionMarket.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  dynamicPoolBasedMinterAddress,
  dynamicPoolBasedMinterAbi,
} from "@/src/generated";
import { mock_usdc, mock_abi } from "@/abi/mock_erc";

export function usePredictionMarket() {
  const [isLoading, setIsLoading] = useState(false);
  const [usdcBalance, setUsdcBalance] = useState("0");
  const [noTokenBalance, setNoTokenBalance] = useState("0");
  const [yesTokenBalance, setYesTokenBalance] = useState("0");
  const [yesPrice, setYesPrice] = useState("0");
  const [noPrice, setNoPrice] = useState("0");
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  // Get USDC balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "balanceOf",
    args: [(address as `0x${string}`) || "0x0"],
    query: {
      enabled: !!address,
    },
  });

  // Get price info from the prediction market contract
  const { data: yesPriceData, refetch: refetchYesPrice } = useReadContract({
    address: dynamicPoolBasedMinterAddress,
    abi: dynamicPoolBasedMinterAbi,
    functionName: "getYESPrice",
  });

  const { data: noPriceData, refetch: refetchNoPrice } = useReadContract({
    address: dynamicPoolBasedMinterAddress,
    abi: dynamicPoolBasedMinterAbi,
    functionName: "getNOPrice",
  });

  // Get tokenX (NO) address
  const { data: tokenXAddress } = useReadContract({
    address: dynamicPoolBasedMinterAddress,
    abi: dynamicPoolBasedMinterAbi,
    functionName: "tokenX",
  });

  // Get tokenY (YES) address
  const { data: tokenYAddress } = useReadContract({
    address: dynamicPoolBasedMinterAddress,
    abi: dynamicPoolBasedMinterAbi,
    functionName: "tokenY",
  });

  // Get NO token balance if address is available
  const { data: noTokenBalanceData, refetch: refetchNoTokenBalance } =
    useReadContract({
      address: tokenXAddress as `0x${string}`,
      abi: mock_abi,
      functionName: "balanceOf",
      args: [(address as `0x${string}`) || "0x0"],
      query: {
        enabled: !!address && !!tokenXAddress,
      },
    });

  // Get YES token balance if address is available
  const { data: yesTokenBalanceData, refetch: refetchYesTokenBalance } =
    useReadContract({
      address: tokenYAddress as `0x${string}`,
      abi: mock_abi,
      functionName: "balanceOf",
      args: [(address as `0x${string}`) || "0x0"],
      query: {
        enabled: !!address && !!tokenYAddress,
      },
    });

  // Update state when data changes
  useEffect(() => {
    if (balance) {
      setUsdcBalance((Number(balance) / 1e18).toString());
    }
    if (noTokenBalanceData) {
      setNoTokenBalance((Number(noTokenBalanceData) / 1e18).toString());
    }
    if (yesTokenBalanceData) {
      setYesTokenBalance((Number(yesTokenBalanceData) / 1e18).toString());
    }
    if (yesPriceData) {
      setYesPrice((Number(yesPriceData) / 1e18).toString());
    }
    if (noPriceData) {
      setNoPrice((Number(noPriceData) / 1e18).toString());
    }
  }, [
    balance,
    noTokenBalanceData,
    yesTokenBalanceData,
    yesPriceData,
    noPriceData,
  ]);

  // Mint USDC tokens
  const mintUSDC = useCallback(
    async (amount: string) => {
      if (!address) throw new Error("Wallet not connected");

      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "mint",
          args: [address, parseEther(amount)],
        });

        // After transaction, refetch balance
        setTimeout(() => refetchBalance(), 2000);
        return hash;
      } catch (error) {
        console.error("Error minting USDC:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [address, writeContract, refetchBalance]
  );

  // Deposit USDC and mint prediction tokens
  const depositAndMint = useCallback(
    async (amount: string) => {
      if (!address) throw new Error("Wallet not connected");

      try {
        setIsLoading(true);

        // First approve the DynamicPoolBasedMinter contract to spend USDC
        const approveHash = await writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "approve",
          args: [dynamicPoolBasedMinterAddress, parseEther(amount)],
        });

        // Wait a bit for the approval to be processed
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Then deposit and mint tokens
        const mintHash = await writeContract({
          address: dynamicPoolBasedMinterAddress,
          abi: dynamicPoolBasedMinterAbi,
          functionName: "depositAndMint",
          args: [parseEther(amount)],
        });

        // Refresh balances after a delay
        setTimeout(() => {
          refetchBalance();
          refetchNoTokenBalance();
          refetchYesTokenBalance();
          refetchYesPrice();
          refetchNoPrice();
        }, 2000);

        return mintHash;
      } catch (error) {
        console.error("Error depositing and minting:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [
      address,
      writeContract,
      refetchBalance,
      refetchNoTokenBalance,
      refetchYesTokenBalance,
      refetchYesPrice,
      refetchNoPrice,
    ]
  );

  // Refresh all balances
  const refreshBalances = useCallback(async () => {
    refetchBalance();
    if (tokenXAddress) refetchNoTokenBalance();
    if (tokenYAddress) refetchYesTokenBalance();
    refetchYesPrice();
    refetchNoPrice();
  }, [
    refetchBalance,
    refetchNoTokenBalance,
    refetchYesTokenBalance,
    refetchYesPrice,
    refetchNoPrice,
    tokenXAddress,
    tokenYAddress,
  ]);

  return {
    usdcBalance,
    noTokenBalance,
    yesTokenBalance,
    yesPrice,
    noPrice,
    mintUSDC,
    depositAndMint,
    refreshBalances,
    isLoading,
  };
}
