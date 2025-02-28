// frontend/hooks/useEncryption.ts
import { useState } from "react";
import { useContractWrite, useContractRead } from "wagmi";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { toast } from "sonner";
import axios from "axios";

// Import the ElGamal functions from the threshold-elgamal library
import {
  generateParameters,
  encrypt,
  decrypt,
  generateKeys,
  combinePublicKeys,
  createDecryptionShare,
  combineDecryptionShares,
  thresholdDecrypt,
} from "threshold-elgamal";

export function useEncryption() {
  const [isLoading, setIsLoading] = useState(false);

  // Contract writes for submitting votes and decrypt shares
  const { writeAsync: submitVoteWrite } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: "modifyVote",
  });

  const { writeAsync: submitDecryptShareWrite } = useContractWrite({
    address: hook_address,
    abi: hook_abi,
    functionName: "submitPartialDecript",
  });

  // Function to send an encrypted vote
  async function sendEncryptedVote(vote: "yes" | "no", publicKeys: string[]) {
    setIsLoading(true);
    try {
      // Convert all public keys to BigInt
      const publicKeysBigInt = publicKeys.map((key) => BigInt(key));

      // Combine all public keys into a single public key
      const combinedKey = combinePublicKeys(publicKeysBigInt);

      // Determine vote value (1 for yes, 2 for no)
      const voteValue = vote === "yes" ? 1 : 2;

      // Encrypt the vote
      const encryptedMessage = encrypt(voteValue, combinedKey);

      // Convert the encrypted message components to strings
      const c1Hex = encryptedMessage.c1.toString();
      const c2Hex = encryptedMessage.c2.toString();

      // Encode for the blockchain
      const abiCoder = new window.ethers.AbiCoder();
      const encodedData = abiCoder.encode(
        ["bytes", "bytes"],
        [`0x${c1Hex}`, `0x${c2Hex}`]
      );

      // Submit the encrypted vote to the contract
      const tx = await submitVoteWrite({ args: [encodedData] });

      // Send to the AVS validator for execution
      try {
        const response = await axios.post("http://localhost:3001/execute", {
          ciphertext: encodedData,
          randomNumber: encryptedMessage.randomness?.toString() || "0",
          taskDefinitionId: 1,
        });
        console.log("AVS response:", response.data);
      } catch (error) {
        console.error("Error submitting to AVS:", error);
        // Even if AVS submission fails, the contract call may have succeeded
      }

      return tx;
    } catch (error) {
      console.error("Error sending encrypted vote:", error);
      toast.error(`Failed to encrypt vote: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Function to submit a decryption share
  async function submitDecryptionShare(privateKeyOrShare: string) {
    setIsLoading(true);
    try {
      // Handle both private keys and already computed decryption shares
      let decryptionShare: string;

      // If this looks like a decryption share (already computed), use as is
      // Otherwise, compute a decryption share from the private key
      if (privateKeyOrShare.length < 100) {
        // Assume it's already a share
        decryptionShare = privateKeyOrShare;
      } else {
        // Get the current encrypted vote from the contract
        const marketData = await fetchMarketData();
        if (!marketData || !marketData.c1 || !marketData.c1.length) {
          throw new Error("No encrypted votes found on the contract");
        }

        // Convert encrypted message from contract format
        const c1 = BigInt(marketData.c1);
        const c2 = BigInt(marketData.c2);
        const encryptedMessage = { c1, c2 };

        // Convert private key to BigInt
        const privateKey = BigInt(privateKeyOrShare);

        // Create decryption share
        const share = createDecryptionShare(encryptedMessage, privateKey);
        decryptionShare = share.toString();
      }

      // Submit decryption share to the contract
      const tx = await submitDecryptShareWrite({ args: [decryptionShare] });
      return tx;
    } catch (error) {
      console.error("Error submitting decryption share:", error);
      toast.error(
        `Failed to submit decryption share: ${(error as Error).message}`
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Helper function to fetch market data
  async function fetchMarketData() {
    const { data: marketData } = await useContractRead.fetch({
      address: hook_address,
      abi: hook_abi,
      functionName: "getMarket",
    });
    return marketData;
  }

  return {
    sendEncryptedVote,
    submitDecryptionShare,
    isLoading,
  };
}
