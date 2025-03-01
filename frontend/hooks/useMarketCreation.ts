// frontend/hooks/useMarketCreation.ts
"use client";

import { useState, useCallback } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { hook_address, hook_abi } from "@/abi/hook_abi";

export function useMarketCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  // Read current market data from the hook contract
  const { data: currentMarket, refetch: refetchMarket } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
  });

  // Create a new market
  const createMarket = useCallback(
    async (
      description: string,
      registrationDelay: number,
      marketLength: number
    ) => {
      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "MakeMarket",
          args: [description, BigInt(registrationDelay), BigInt(marketLength)],
        });

        // After transaction, refetch market data
        setTimeout(() => refetchMarket(), 2000);
        return hash;
      } catch (error) {
        console.error("Error creating market:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract, refetchMarket]
  );

  // Submit a public key
  const submitKey = useCallback(
    async (publicKey: string) => {
      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "submitKey",
          args: [publicKey],
        });

        // After transaction, refetch market data
        setTimeout(() => refetchMarket(), 2000);
        return hash;
      } catch (error) {
        console.error("Error submitting key:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract, refetchMarket]
  );

  // Add a common public key (for testing purposes)
  const addCommonPublicKey = useCallback(async () => {
    const COMMON_PUBLIC_KEY = "2561358976496158367523846754334566723";
    return await submitKey(COMMON_PUBLIC_KEY);
  }, [submitKey]);

  // Choose a winner
  const chooseWinner = useCallback(
    async (winner: boolean) => {
      try {
        setIsLoading(true);
        const hash = await writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "chooseWinner",
          args: [winner],
        });

        // After transaction, refetch market data
        setTimeout(() => refetchMarket(), 2000);
        return hash;
      } catch (error) {
        console.error("Error choosing winner:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [writeContract, refetchMarket]
  );

  return {
    currentMarket,
    createMarket,
    submitKey,
    addCommonPublicKey,
    chooseWinner,
    refetchMarket,
    isLoading,
  };
}
