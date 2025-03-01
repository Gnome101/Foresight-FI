// frontend/hooks/useMarketCreation.ts
"use client";

import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { toast } from "sonner";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { ethers } from "ethers";
// Common public key for testing - matches the common private key
const COMMON_PUBLIC_KEY =
  "8807131937870853617817564045914847910543334837234635170592973811957980539798611295063322593632718691891467692327193996909124741998636379499391022863684377129304089835421753010451426993231437524999937040976325318468778101042769455225215468177477476513704642471624253241889689331841164162251050401783902151285517325323135707426794275480542031791471145020447309285703257854651655521386879932393955996188424314042310359106510620259290443842551338598177123355253399757529426541717857380687908984633711669422686461247704465408473348336388936996122848021376354211629411851061092165719400904405460315883861280703529906889787";

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
  const { writeContract } = useWriteContract();

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
        args: [ethers.toBeHex(publicKey)],
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
  const addCommonPublicKey = async () => {
    return submitKey(COMMON_PUBLIC_KEY);
  };

  // Choose winner and finalize market
  // const chooseWinner = async (isYesWinner: boolean) => {
  //   setIsLoading(true);
  //   try {
  //     writeContract({
  //       address: hook_address,
  //       abi: hook_abi,
  //       functionName: "chooseWinner",
  //       args: [isYesWinner],
  //     });
  //     setIsSuccess(true);
  //     setTimeout(() => refetchMarket(), 5000); // Refresh market data after tx
  //   } catch (error) {
  //     console.error("Error finalizing market:", error);
  //     toast.error("Failed to finalize market");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return {
    createMarket,
    submitKey,
    addCommonPublicKey,
    // chooseWinner,
    currentMarket,
    isLoading: isLoading || isMarketLoading,
    isSuccess,
    refetchMarket,
  };
}
