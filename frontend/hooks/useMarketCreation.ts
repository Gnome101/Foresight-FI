// frontend/hooks/useMarketCreation.ts
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { mock_usdc, mock_abi } from "@/abi/mock_erc";
import { parseEther } from "viem";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";

// Market type definition matching the contract structure
export type Market = {
  description: string;
  keyRegistrationExpiration: bigint;
  expiration: bigint;
  c1: string;
  c2: string;
  publicKeys: string[];
  partialDecripts: string[];
  isFinalized: boolean;
  winner: boolean;
};

// Default empty market structure
const emptyMarket: Market = {
  description: "",
  keyRegistrationExpiration: 0n,
  expiration: 0n,
  c1: "0x",
  c2: "0x",
  publicKeys: [],
  partialDecripts: [],
  isFinalized: false,
  winner: false,
};

export function useMarketCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalAmount, setApprovalAmount] = useState<bigint>(0n);
  const { address } = useAppKitAccount();

  // Read the current market data
  const { data: marketData, refetch } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "getMarket",
  });

  // Contract write setup
  const { writeContract, data: txHash } = useWriteContract();

  // Get current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "allowance",
    args: [address as `0x${string}`, hook_address],
    query: {
      enabled: !!address,
    },
  });

  // Parse the market data to the expected format
  const currentMarket: Market = marketData
    ? {
        description: marketData.description,
        keyRegistrationExpiration: marketData.keyRegistrationExpiration,
        expiration: marketData.expiration,
        c1: marketData.c1,
        c2: marketData.c2,
        publicKeys: marketData.publicKeys,
        partialDecripts: marketData.partialDecripts,
        isFinalized: marketData.isFinalized,
        winner: marketData.winner,
      }
    : emptyMarket;

  // Check if approval is needed for a given amount
  const checkApprovalNeeded = async (amount: string) => {
    if (!address) return;

    const amountWei = parseEther(amount);
    setApprovalAmount(amountWei);

    if (!allowance || allowance < amountWei) {
      setNeedsApproval(true);
    } else {
      setNeedsApproval(false);
    }
  };

  // Approve USDC spending
  const approveUSDC = async () => {
    if (!address || approvalAmount === 0n) return;

    try {
      setIsLoading(true);
      toast.info("Approving USDC transfer...");

      writeContract({
        address: mock_usdc,
        abi: mock_abi,
        functionName: "approve",
        args: [hook_address, approvalAmount],
      });

      // Wait for approval transaction to be mined
      toast.info("Waiting for approval transaction to be confirmed...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await refetchAllowance();
      setNeedsApproval(false);
      toast.success("USDC approved successfully!");

      return true;
    } catch (error) {
      console.error("Error approving USDC:", error);
      toast.error("Failed to approve USDC");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const derivePoolPrice = (deposit: bigint, noTokens: bigint) => {
    // Ensure deposit is greater than yesTokens to avoid division by zero.
    if (deposit < noTokens) {
      throw new Error(
        "Deposit must be greater than yesTokens to derive a valid pool price."
      );
    }

    // Calculate poolPrice as: (yesTokens * DECIMALS) / (deposit - yesTokens)
    const poolPrice = (deposit * parseEther("1")) / noTokens - parseEther("1");
    return poolPrice;
  };
  // Create a new market
  const createMarket = async (
    description: string,
    registrationDelay: number,
    marketLength: number,
    initialUSDC: string = "1000",
    startPrice: string = "0.5"
  ) => {
    if (!address) throw new Error("No connected address");

    try {
      setIsLoading(true);

      // Convert startPrice from decimal to wad (e.g., 0.5 -> 0.5 * 10^18)

      const startPriceWad = parseEther(startPrice);
      const initialUSDCAmount = parseEther(initialUSDC);
      const yesAmount = parseFloat(initialUSDC) * parseFloat(startPrice);
      const noAmount = parseFloat(initialUSDC) - yesAmount;
      const noAmountWad = parseEther(noAmount.toString());
      console.log(noAmountWad);
      // Check if approval is needed first
      await checkApprovalNeeded(initialUSDC);

      // If approval needed, handle it first
      console.log("Nede", needsApproval);
      if (needsApproval) {
        const approved = await approveUSDC();
        if (!approved) {
          setIsLoading(false);
          return;
        }
      }
      console.log("her");
      // Now create the market
      toast.info("Creating market...");
      console.log(derivePoolPrice(initialUSDCAmount, noAmountWad));
      console.log(BigInt(registrationDelay));
      console.log(BigInt(marketLength));
      console.log(initialUSDCAmount);
      console.log(description);

      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "MakeMarket",
        args: [
          description,
          BigInt(registrationDelay),
          BigInt(marketLength),
          initialUSDCAmount,
          derivePoolPrice(initialUSDCAmount, noAmountWad),
        ],
      });

      // Wait for transaction to be mined
      toast.info("Waiting for market creation transaction to be confirmed...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Refresh market data
      await refetch();
      await refetchAllowance();
      toast.success("Market created successfully!");
    } catch (error) {
      console.error("Error creating market:", error);
      toast.error("Failed to create market");
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a key to the market
  const submitKey = async (publicKey: string) => {
    try {
      setIsLoading(true);
      const txHash = await writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "submitKey",
        args: [publicKey],
      });

      // Wait for transaction to be mined
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await refetch();
      return true;
    } catch (error) {
      console.error("Error submitting key:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a common public key for testing
  const addCommonPublicKey = async () => {
    return submitKey(
      "8807131937870853617817564045914847910543334837234635170592973811957980539798611295063322593632718691891467692327193996909124741998636379499391022863684377129304089835421753010451426993231437524999937040976325318468778101042769455225215468177477476513704642471624253241889689331841164162251050401783902151285517325323135707426794275480542031791471145020447309285703257854651655521386879932393955996188424314042310359106510620259290443842551338598177123355253399757529426541717857380687908984633711669422686461247704465408473348336388936996122848021376354211629411851061092165719400904405460315883861280703529906889787"
    );
  };

  // Effect to check approval needs when amount changes
  useEffect(() => {
    if (address) {
      checkApprovalNeeded("1000"); // Default amount
    }
  }, [address, allowance]);

  return {
    currentMarket,
    isLoading,
    needsApproval,
    approveUSDC,
    createMarket,
    submitKey,
    addCommonPublicKey,
    refetchMarket: refetch,
    checkApprovalNeeded,
  };
}
