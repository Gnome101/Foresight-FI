// frontend/hooks/useMarketCreation.ts
"use client";

import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { toast } from "sonner";
import { hook_address, hook_abi } from "@/abi/hook_abi";

// Common public key for testing - matches the common private key
const COMMON_PUBLIC_KEY =
  "78777152258821625139936547546291511557679031405818487632881834625099576878936300048426915070239433588639217997115195504942071929259506667920297233513537623";

export function useMarketCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Read current market data
  // const {
  //   data: currentMarket,
  //   isLoading: isMarketLoading,
  //   refetch: refetchMarket,
  // } = useContractRead({
  //   address: hook_address,
  //   abi: hook_abi,
  //   functionName: "getMarket",
  // });
  const {
    data: currentMarket,
    isLoading: isMarketLoading,
    refetch: refetchMarket,
  } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
    args: [],
  });
  const { writeContract, data: txHash } = useWriteContract();

  // Create a new market
  const createMarket = async (
    description: string,
    registrationDelay: number,
    marketLength: number
  ) => {
    setIsLoading(true);
    try {
      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "MakeMarket",
        args: [description, BigInt(registrationDelay), BigInt(marketLength)],
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating market:", error);
      toast.error("Failed to create market");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a public key
  const submitKey = async (publicKey: string) => {
    setIsLoading(true);
    try {
      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "submitKey",
        args: [publicKey],
      });

      setIsSuccess(true);
      setTimeout(() => refetchMarket(), 5000); // Refresh market data after tx
    } catch (error) {
      console.error("Error submitting key:", error);
      toast.error("Failed to submit key");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Use common public key (for testing)
  const useCommonPublicKey = async () => {
    return submitKey(COMMON_PUBLIC_KEY);
  };

  // Choose winner and finalize market
  const chooseWinner = async (isYesWinner: boolean) => {
    setIsLoading(true);
    try {
      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "chooseWinner",
        args: [isYesWinner],
      });
      setIsSuccess(true);
      setTimeout(() => refetchMarket(), 5000); // Refresh market data after tx
    } catch (error) {
      console.error("Error finalizing market:", error);
      toast.error("Failed to finalize market");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMarket,
    submitKey,
    useCommonPublicKey,
    chooseWinner,
    currentMarket,
    isLoading: isLoading || isMarketLoading,
    isSuccess,
    refetchMarket,
  };
}
