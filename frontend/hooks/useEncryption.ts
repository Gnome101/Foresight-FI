// frontend/hooks/useEncryption.ts
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useWriteContract } from "wagmi";
import { hook_abi, hook_address } from "@/abi/hook_abi";
import { useAppKitAccount } from "@reown/appkit/react";
import { ethers } from "ethers";

// This would typically come from a threshold-elgamal library
// We're mocking these functions for now based on your SendEncrypt.js script
const mockEncryptFunctions = {
  // Mock encrypt function - in production this would use threshold-elgamal
  encryptVote: (vote: "yes" | "no", publicKey: string) => {
    // Generate mock encrypted values for demonstration
    const c1 = ethers.randomBytes(32);
    const c2 = ethers.randomBytes(32);

    return {
      c1: ethers.hexlify(c1),
      c2: ethers.hexlify(c2),
    };
  },

  // Mock generate partial decryption share
  generateDecryptionShare: (privateKey: string) => {
    // In a real implementation, this would use the threshold-elgamal library
    // to generate a proper decryption share
    return ethers.hexlify(ethers.randomBytes(32));
  },
};

export function useEncryption() {
  const { address, isConnected } = useAppKitAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { writeContract } = useWriteContract();

  // Encrypt and send a vote
  const sendEncryptedVote = useCallback(
    async (vote: "yes" | "no", publicKeys: string[]) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (publicKeys.length === 0) {
        toast.error("No public keys available for encryption");
        return;
      }

      try {
        setIsLoading(true);

        // In production, you would use actual threshold encryption
        // For now, we'll use a mock function
        const encryptedVote = mockEncryptFunctions.encryptVote(
          vote,
          publicKeys[0]
        );

        console.log("Sending encrypted vote:", {
          vote,
          c1: encryptedVote.c1,
          c2: encryptedVote.c2,
        });

        // Encode the encrypted vote as expected by the contract
        const voteData = ethers.AbiCoder.defaultAbiCoder().encode(
          ["bytes", "bytes"],
          [encryptedVote.c1, encryptedVote.c2]
        );

        // Send the encrypted vote to the contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "modifyVote",
          args: [voteData],
        });

        toast.success("Vote submitted");
      } catch (err) {
        console.error("Error sending encrypted vote:", err);
        toast.error(err instanceof Error ? err.message : "Failed to send vote");
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  // Generate and submit a partial decryption share
  const submitDecryptionShare = useCallback(
    async (privateKey: string) => {
      if (!isConnected) {
        toast.error("Please connect your wallet first");
        return;
      }

      try {
        setIsLoading(true);

        // In production, you would use actual threshold decryption
        // For now, we'll use a mock function
        const decryptionShare =
          mockEncryptFunctions.generateDecryptionShare(privateKey);

        console.log("Submitting decryption share:", decryptionShare);

        // Submit the decryption share to the contract
        writeContract({
          address: hook_address,
          abi: hook_abi,
          functionName: "submitPartialDecript",
          args: [decryptionShare],
        });

        toast.success("Decryption share submitted");
      } catch (err) {
        console.error("Error submitting decryption share:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to submit decryption share"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isConnected, writeContract]
  );

  return {
    sendEncryptedVote,
    submitDecryptionShare,
    isLoading,
  };
}
