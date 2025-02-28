// frontend/hooks/useMarketCreation.ts
import { useCallback, useState } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
} from "wagmi";
import { hook_abi, hook_address } from "@/abi/hook_abi";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "sonner";
import { ethers } from "ethers";

// Common key constants
const COMMON_PUBLIC_KEY = ethers.toBeHex(
  "8807131937870853617817564045914847910543334837234635170592973811957980539798611295063322593632718691891467692327193996909124741998636379499391022863684377129304089835421753010451426993231437524999937040976325318468778101042769455225215468177477476513704642471624253241889689331841164162251050401783902151285517325323135707426794275480542031791471145020447309285703257854651655521386879932393955996188424314042310359106510620259290443842551338598177123355253399757529426541717857380687908984633711669422686461247704465408473348336388936996122848021376354211629411851061092165719400904405460315883861280703529906889787"
);

const COMMON_PRIVATE_KEY = ethers.toBeHex(
  "17198111189740987207522258066070924659068354664866153349209472785674371270060091762895376871405096450964189332505989014717404517835761512453664757667426820217481440982146617209935641204979498323812441179740390809704275764217718676871508299641960392693502986024702569368107809778413850853826168369425962712173790018017361397615845706791905366069526727215230586745271719003886933530843871633556938220645881606394868643579850622075915590012962791258951480013534977101779599471939324439360030244729834387834027239088977696746477158659363343219175191100820364097049332480659184824130271435766049092620682590274475536856966"
);

export function useMarketCreation() {
  const { address, isConnected } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Set up contract write functionality
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read current market details
  const { data: currentMarket, refetch: refetchMarket } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
    query: {
      enabled: true,
    },
  });

  // Create a new market
  const createMarket = useCallback(
    async (
      description: string,
      registrationDelay: number, // in seconds
      marketLength: number // in seconds
    ) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        console.log("Creating market:", {
          description,
          registrationDelay,
          marketLength,
        });

        // Call the MakeMarket function on the Hook contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "MakeMarket",
          args: [description, BigInt(registrationDelay), BigInt(marketLength)],
        });
      } catch (err) {
        console.error("Error creating market:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to create market"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  // Submit a custom public key
  const submitKey = useCallback(
    async (publicKey: string) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        console.log("Submitting key:", publicKey);

        // Call the submitKey function on the Hook contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "submitKey",
          args: [publicKey],
        });
      } catch (err) {
        console.error("Error submitting key:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to submit key"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  // Submit the common public key
  const useCommonPublicKey = useCallback(async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setIsLoading(true);

      console.log("Using common public key");

      // Call submitKey with the predefined common public key
      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "submitKey",
        args: [COMMON_PUBLIC_KEY],
      });
    } catch (err) {
      console.error("Error submitting common key:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to submit common key"
      );
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, writeContract]);

  // Submit partial decryption share
  const submitPartialDecrypt = useCallback(
    async (decryptShare: string) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        // Call the submitPartialDecript function on the Hook contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "submitPartialDecript",
          args: [decryptShare],
        });
      } catch (err) {
        console.error("Error submitting decrypt share:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to submit decrypt share"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  // Choose winner (finalize market)
  const chooseWinner = useCallback(
    async (isYesWinner: boolean) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        // Call the chooseWinner function on the Hook contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "chooseWinner",
          args: [isYesWinner],
        });
      } catch (err) {
        console.error("Error finalizing market:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to finalize market"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  // Format the market data for display
  const formatMarketData = (market: any) => {
    if (!market) return null;

    return {
      description: market.description,
      keyRegistrationExpiration:
        Number(market.keyRegistrationExpiration) * 1000, // convert to milliseconds
      expiration: Number(market.expiration) * 1000, // convert to milliseconds
      isFinalized: market.isFinalized,
      winner: market.winner,
      publicKeys: market.publicKeys,
      partialDecripts: market.partialDecripts,
    };
  };

  const formattedMarket = currentMarket
    ? formatMarketData(currentMarket)
    : null;

  return {
    currentMarket: formattedMarket,
    createMarket,
    submitKey,
    useCommonPublicKey,
    submitPartialDecrypt,
    chooseWinner,
    refetchMarket,
    isLoading: isLoading || isTxLoading,
    isSuccess,
    COMMON_PUBLIC_KEY, // Export the common public key for reference
  };
}
