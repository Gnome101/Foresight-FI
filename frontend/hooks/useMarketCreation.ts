// frontend/hooks/useMarketCreation.ts
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { hook_address, hook_abi } from "@/abi/hook_abi";

// Define the Market type to match the contract structure
type Market = {
  description: string;
  keyRegistrationExpiration: number;
  expiration: number;
  c1: string;
  c2: string;
  publicKeys: string[];
  partialDecripts: string[];
  isFinalized: boolean;
  winner: boolean;
};

export function useMarketCreation() {
  const [currentMarket, setCurrentMarket] = useState<Market | null>(null);
  const {
    data: writeData,
    writeContract,
    isPending,
    isSuccess,
    error,
  } = useWriteContract();

  // Fetch market data from the contract
  const { data: marketData, refetch } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
  });

  // Fetch keys separately
  const { data: keysData, refetch: refetchKeys } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getKeys",
  });

  // Fetch decryption shares separately
  const { data: sharesData, refetch: refetchShares } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getDecryptionShares",
  });

  // Convert timestamps from seconds to milliseconds for JavaScript Date
  const processMarketData = useCallback(() => {
    if (marketData) {
      const processedMarket = {
        ...marketData,
        // Convert timestamps from seconds to milliseconds
        keyRegistrationExpiration:
          Number(marketData.keyRegistrationExpiration) * 1000,
        expiration: Number(marketData.expiration) * 1000,
        // Ensure arrays are properly initialized
        publicKeys: Array.isArray(marketData.publicKeys)
          ? marketData.publicKeys
          : [],
        partialDecripts: Array.isArray(marketData.partialDecripts)
          ? marketData.partialDecripts
          : [],
      };

      // If we have separate key data, override the publicKeys from marketData
      if (keysData && Array.isArray(keysData)) {
        processedMarket.publicKeys = keysData;
      }

      // If we have separate shares data, override the partialDecripts from marketData
      if (sharesData && Array.isArray(sharesData)) {
        processedMarket.partialDecripts = sharesData;
      }

      setCurrentMarket(processedMarket);
    }
  }, [marketData, keysData, sharesData]);

  // Process market data whenever it changes
  useEffect(() => {
    processMarketData();
  }, [processMarketData]);

  // Function to create a new market
  const createMarket = useCallback(
    (description: string, registrationDelay: number, marketLength: number) => {
      try {
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "MakeMarket",
          args: [description, BigInt(registrationDelay), BigInt(marketLength)],
        });
      } catch (err) {
        console.error("Error creating market:", err);
        toast.error("Failed to create market");
      }
    },
    [writeContract]
  );

  // Function to submit a public key
  const submitKey = useCallback(
    (publicKey: string) => {
      try {
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "submitKey",
          args: [publicKey],
        });
      } catch (err) {
        console.error("Error submitting key:", err);
        toast.error("Failed to submit key");
      }
    },
    [writeContract]
  );

  // Common public key for testing
  const commonPublicKey =
    "17198111189740987207522258066070924659068354664866153349209472785674371270060091762895376871405096450964189332505989014717404517835761512453664757667426820217481440982146617209935641204979498323812441179740390809704275764217718676871508299641960392693502986024702569368107809778413850853826168369425962712173790018017361397615845706791905366069526727215230586745271719003886933530843871633556938220645881606394868643579850622075915590012962791258951480013534977101779599471939324439360030244729834387834027239088977696746477158659363343219175191100820364097049332480659184824130271435766049092620682590274475536856966";

  // Function to use the common public key for testing
  const useCommonPublicKey = useCallback(() => {
    submitKey(commonPublicKey);
  }, [submitKey]);

  // Function to choose a winner
  const chooseWinner = useCallback(
    (isYesWinner: boolean) => {
      try {
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "chooseWinner",
          args: [isYesWinner],
        });
      } catch (err) {
        console.error("Error choosing winner:", err);
        toast.error("Failed to choose winner");
      }
    },
    [writeContract]
  );

  // Refetch all market data
  const refetchMarket = useCallback(async () => {
    try {
      await Promise.all([refetch(), refetchKeys(), refetchShares()]);
      processMarketData();
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  }, [refetch, refetchKeys, refetchShares, processMarketData]);

  return {
    currentMarket,
    createMarket,
    submitKey,
    useCommonPublicKey,
    chooseWinner,
    refetchMarket,
    isLoading: isPending,
    isSuccess,
    error,
  };
}
