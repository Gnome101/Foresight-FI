// frontend/hooks/useMarketCreation.ts
import { useState } from "react";
import { useContractWrite, useContractRead } from "wagmi";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { toast } from "sonner";

// Common test public key (corresponds to the COMMON_PRIVATE_KEY)
const COMMON_PUBLIC_KEY =
  "11957493999975269444464755610171302712985137680089913537371358803322489711030025529116263805543707198443121970636766676484013609572734723172897208835192129124130634220683608335934059747167798716303987741061276866722350649021701544866654073505300997339438076706903926084680273666247769585172889516660003871292977604307945575256562989339249618571820077388882124184551057081570158782308257997693753732629705161486226538884024512134465009061557175789020174254979326550204617276432073895111208583762714600808838676211892505793571953538566719419984299064603250594862261689781636324826532393217093148307757090045099607153113";

export function useMarketCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Contract read for market data
  const { data: marketData, refetch } = useContractRead({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
  });

  // Contract writes
  const { writeAsync: createMarketWrite } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: "MakeMarket",
  });

  const { writeAsync: submitKeyWrite } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: "submitKey",
  });

  const { writeAsync: chooseWinnerWrite } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: "chooseWinner",
  });

  // Create a new market
  async function createMarket(
    description: string,
    registrationDelay: number,
    marketLength: number
  ) {
    setIsLoading(true);
    try {
      const tx = await createMarketWrite({
        args: [description, BigInt(registrationDelay), BigInt(marketLength)],
      });
      setIsSuccess(true);
      return tx;
    } catch (error) {
      console.error("Error creating market:", error);
      toast.error(`Failed to create market: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Submit a public key
  async function submitKey(publicKey: string) {
    setIsLoading(true);
    try {
      const tx = await submitKeyWrite({ args: [publicKey] });
      await refetch();
      return tx;
    } catch (error) {
      console.error("Error submitting key:", error);
      toast.error(`Failed to submit key: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Use a common public key for testing
  async function useCommonPublicKey() {
    return submitKey(COMMON_PUBLIC_KEY);
  }

  // Choose the winner of the market
  async function chooseWinner(isYesWinner: boolean) {
    setIsLoading(true);
    try {
      const tx = await chooseWinnerWrite({ args: [isYesWinner] });
      await refetch();
      return tx;
    } catch (error) {
      console.error("Error choosing winner:", error);
      toast.error(`Failed to choose winner: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Utility function to refetch market data
  const refetchMarket = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Error refetching market data:", error);
    }
  };

  return {
    currentMarket: marketData,
    createMarket,
    submitKey,
    useCommonPublicKey,
    chooseWinner,
    refetchMarket,
    isLoading,
    isSuccess,
  };
}
