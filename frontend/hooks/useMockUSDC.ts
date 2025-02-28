import { useCallback, useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { mock_abi, mock_usdc } from "@/abi/mock_erc";
import { useAppKitAccount } from "@reown/appkit/react";
import { parseUnits } from "ethers";

export function useMockUSDC() {
  const { address } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up contract write functionality
  const { writeContract, data: txHash } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Read USDC balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: mock_usdc,
    abi: mock_abi,
    functionName: "balanceOf",
    args: [(address as `0x${string}`) || "0x0"],
    query: {
      enabled: !!address,
    },
  });

  // Mint USDC tokens (for testing)
  const mintUSDC = useCallback(
    async (amount: string) => {
      if (!address) {
        setError("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Convert amount to the correct format (6 decimals for USDC)
        const parsedAmount = parseUnits(amount, 6);

        // Call the mint function on the mock USDC contract
        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "mint",
          args: [address as `0x${string}`, parsedAmount],
        });
      } catch (err) {
        console.error("Error minting USDC:", err);
        setError(err instanceof Error ? err.message : "Failed to mint USDC");
      } finally {
        setIsLoading(false);
      }
    },
    [address, writeContract]
  );

  // Approve spending of USDC by another contract
  const approveUSDC = useCallback(
    async (spenderAddress: string, amount: string) => {
      if (!address) {
        setError("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Convert amount to the correct format (6 decimals for USDC)
        const parsedAmount = parseUnits(amount, 6);

        // Call the approve function on the mock USDC contract
        writeContract({
          address: mock_usdc,
          abi: mock_abi,
          functionName: "approve",
          args: [spenderAddress as `0x${string}`, parsedAmount],
        });
      } catch (err) {
        console.error("Error approving USDC:", err);
        setError(err instanceof Error ? err.message : "Failed to approve USDC");
      } finally {
        setIsLoading(false);
      }
    },
    [address, writeContract]
  );

  // Format the balance for display
  const formattedBalance = balance
    ? (Number(balance) / 10 ** 6).toFixed(2)
    : "0.00";

  return {
    balance: formattedBalance,
    mintUSDC,
    approveUSDC,
    refetchBalance,
    isLoading: isLoading || isTxLoading,
    isSuccess,
    error,
  };
}
