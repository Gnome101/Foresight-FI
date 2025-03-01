// frontend/hooks/usePredictionMarket.ts
import { useState, useCallback, useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, formatEther } from "viem";
import { mock_usdc, mock_abi } from "@/abi/mock_erc";
import {
  dynamicPoolBasedMinterAddress,
  dynamicPoolBasedMinterAbi,
} from "@/src/generated";
import { mint_address, mint_abi } from "@/abi/dynamic_mint";

import { toast } from "sonner";

export function usePredictionMarket() {
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalAmount, setApprovalAmount] = useState<bigint>(0n);

  // Contract write setup
  const { writeContract, data: txHash } = useWriteContract();

  // Transaction status
  const { isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read USDC balance
  const { data: usdcBalanceData, refetch: refetchUsdcBalance } =
    useReadContract({
      address: mock_usdc,
      abi: mock_abi,
      functionName: "balanceOf",
      args: [(address as `0x${string}`) || "0x0"],
      query: {
        enabled: !!address,
      },
    });

  // Read USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "allowance",
    args: [(address as `0x${string}`) || "0x0", dynamicPoolBasedMinterAddress],
    query: {
      enabled: !!address,
    },
  });

  // Formatted USDC balance
  const usdcBalance = usdcBalanceData ? formatEther(usdcBalanceData) : "0";

  // Price data for YES token
  const { data: yesPriceData, refetch: refetchYesPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getYESPrice",
    query: {
      enabled: !!address,
    },
  });

  // Price data for NO token
  const { data: noPriceData, refetch: refetchNoPrice } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "getNOPrice",
    query: {
      enabled: !!address,
    },
  });

  // Get token addresses from the minter contract
  const { data: tokenXData } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "tokenX",
    query: {
      enabled: !!address,
    },
  });

  const { data: tokenYData } = useReadContract({
    address: mint_address,
    abi: mint_abi,
    functionName: "tokenY",
    query: {
      enabled: !!address,
    },
  });

  // Balance fetching for token X (NO)
  const { data: noTokenBalanceData, refetch: refetchNoBalance } =
    useReadContract({
      address: tokenXData as `0x${string}` | undefined,
      abi: mock_abi,
      functionName: "balanceOf",
      args: [(address as `0x${string}`) || "0x0"],
      query: {
        enabled: !!address && !!tokenXData,
      },
    });

  // Balance fetching for token Y (YES)
  const { data: yesTokenBalanceData, refetch: refetchYesBalance } =
    useReadContract({
      address: tokenYData as `0x${string}` | undefined,
      abi: mock_abi,
      functionName: "balanceOf",
      args: [(address as `0x${string}`) || "0x0"],
      query: {
        enabled: !!address && !!tokenYData,
      },
    });
  // Formatted token balances
  const noTokenBalance = noTokenBalanceData
    ? formatEther(noTokenBalanceData)
    : "0";
  const yesTokenBalance = yesTokenBalanceData
    ? formatEther(yesTokenBalanceData)
    : "0";

  // Formatted prices
  const yesPrice = yesPriceData ? formatEther(yesPriceData) : "0";
  const noPrice = noPriceData ? formatEther(noPriceData) : "0";
  console.log(noPrice, yesPrice);

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
        args: [mint_address, approvalAmount],
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

  // Mint USDC to user's wallet
  const mintUSDC = async (amount: string) => {
    if (!address) throw new Error("No connected address");

    try {
      setIsLoading(true);
      const amountWei = parseEther(amount);

      toast.info("Minting USDC...");

      await writeContract({
        address: mock_usdc,
        abi: mock_abi,
        functionName: "mint",
        args: [address, amountWei],
      });

      // Wait for transaction to be mined
      toast.info("Waiting for transaction confirmation...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      await refetchUsdcBalance();
      return true;
    } catch (error) {
      console.error("Error minting USDC:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit USDC and mint prediction tokens
  const depositAndMint = async (amount: string) => {
    if (!address) throw new Error("No connected address");
    console.log("Deposit and minting...");
    try {
      setIsLoading(true);
      const amountWei = parseEther(amount);

      // Check if approval is needed
      await checkApprovalNeeded(amount);
      console.log("Needs approval:", needsApproval);
      // If approval needed, handle it first
      if (needsApproval) {
        const approved = await approveUSDC();
        if (!approved) {
          setIsLoading(false);
          return;
        }
      }

      // Now deposit and mint tokens
      toast.info("Depositing USDC and minting prediction tokens...");
      console.log(amountWei);
      writeContract({
        address: mint_address,
        abi: mint_abi,
        functionName: "depositAndMint",
        args: [amountWei],
      });

      // Wait for transaction to be mined
      toast.info("Waiting for transaction confirmation...");
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Refresh all balances
      await refreshBalances();
      toast.success("Tokens minted successfully!");

      return true;
    } catch (error) {
      console.error("Error depositing and minting:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh all balances and prices
  const refreshBalances = useCallback(async () => {
    try {
      await Promise.all([
        refetchUsdcBalance(),
        refetchNoBalance(),
        refetchYesBalance(),
        refetchYesPrice(),
        refetchNoPrice(),
        refetchAllowance(),
      ]);
    } catch (error) {
      console.error("Error refreshing balances:", error);
    }
  }, [
    refetchUsdcBalance,
    refetchNoBalance,
    refetchYesBalance,
    refetchYesPrice,
    refetchNoPrice,
    refetchAllowance,
  ]);

  // Effect to check approval needs when deposit amount changes
  useEffect(() => {
    if (address) {
      checkApprovalNeeded("10"); // Default amount
    }
  }, [address, allowance]);

  return {
    usdcBalance,
    noTokenBalance,
    yesTokenBalance,
    yesPrice,
    noPrice,
    needsApproval,
    isLoading: isLoading || isTxLoading,
    mintUSDC,
    approveUSDC,
    depositAndMint,
    refreshBalances,
    checkApprovalNeeded,
  };
}
