// frontend/hooks/useEncryption.ts
import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import { hook_address, hook_abi } from "@/abi/hook_abi";
import { toast } from "sonner";
import axios from "axios";
import { ethers } from "ethers";
// Import the ElGamal functions from the threshold-elgamal library
import {
  generateParameters,
  combinePublicKeys,
  createDecryptionShare,
} from "threshold-elgamal";
import { modPow } from "bigint-mod-arith";

export function useEncryption() {
  const [isLoading, setIsLoading] = useState(false);

  const { data: market, refetch: getMarket } = useReadContract({
    address: hook_address,
    abi: hook_abi,
    functionName: "market",
    args: [],
  });
  const { writeContract, data: txHash } = useWriteContract();

  // Function to send an encrypted vote
  async function sendEncryptedVote(vote: "yes" | "no", publicKeys: string[]) {
    setIsLoading(true);
    try {
      // Convert all public keys to BigInt
      const publicKeysBigInt = publicKeys.map((key) => BigInt(key));

      // Combine all public keys into a single public key
      const combinedKey = combinePublicKeys(publicKeysBigInt);

      // Determine vote value (1 for yes, 2 for no)
      const voteValue = vote === "yes" ? 3 : 2;
      const { prime, generator } = generateParameters();

      // Encrypt the vote
      // const encryptedMessage = encrypt(voteValue, combinedKey);
      const { encryptedMessage, randomNumber } = encryptShowRandom(
        voteValue,
        combinedKey,
        prime,
        generator
      );
      // Convert the encrypted message components to strings
      const c1Hex = ethers.toBeHex(encryptedMessage.c1.toString());
      const c2Hex = ethers.toBeHex(encryptedMessage.c2.toString());

      // Encode for the blockchain
      const abiCoder = new ethers.AbiCoder();
      const encodedData = abiCoder.encode(
        ["bytes", "bytes"],
        [c1Hex.toString(), c2Hex.toString()]
      );
      console.log(c1Hex.toString());
      console.log(c2Hex.toString());

      console.log(encodedData);
      // Submit the encrypted vote to the contract
      // const tx = await submitVoteWrite({ args: [encodedData] });

      // Send to the AVS validator for execution
      try {
        const response = await axios.post(
          "http://localhost:4003/task/execute",
          {
            ciphertext: encodedData.toString(),
            randomNumber: randomNumber.toString(),
          }
        );
        console.log("AVS response:", response.data);
      } catch (error) {
        console.error("Error submitting to AVS:", error);
        // Even if AVS submission fails, the contract call may have succeeded
      }
    } catch (error) {
      console.error("Error sending encrypted vote:", error);
      toast.error(`Failed to encrypt vote: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Function to submit a decryption share
  async function submitDecryptionShare(_privateKey: string) {
    setIsLoading(true);
    try {
      // Handle both private keys and already computed decryption shares
      // If this looks like a decryption share (already computed), use as is
      // Otherwise, compute a decryption share from the private key

      // Get the current encrypted vote from the contract
      getMarket();
      console.log(market);
      const marketData = {
        c1: market![3],
        c2: market![4],
      };
      if (
        !marketData ||
        marketData.c1.toString() == "0x" ||
        !marketData.c1.length
      ) {
        throw new Error("No encrypted votes found on the contract");
      }

      console.log(market);
      // Convert encrypted message from contract format
      console.log(marketData.c1.toString());
      const c1 = ethers.toBigInt(marketData.c1.toString());
      const c2 = ethers.toBigInt(marketData.c2.toString());
      const encryptedMessage = { c1, c2 };

      // Convert private key to BigInt
      const privateKey = BigInt(_privateKey);

      // Create decryption share
      const share = createDecryptionShare(encryptedMessage, privateKey);
      const decryptionShare = share.toString();

      // Submit decryption share to the contract
      writeContract({
        address: hook_address,
        abi: hook_abi,
        functionName: "submitPartialDecript",
        args: [decryptionShare],
      });
      return txHash;
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
  async function decryptVotes() {
    setIsLoading(true);
    try {
      // Send to the AVS validator for execution
      try {
        const response = await axios.post(
          "http://localhost:4003/task/execute",
          {}
        );
        console.log("AVS response:", response.data);
      } catch (error) {
        console.error("Error submitting to AVS:", error);
        // Even if AVS submission fails, the contract call may have succeeded
      }
    } catch (error) {
      console.error("Error sending encrypted vote:", error);
      toast.error(`Failed to encrypt vote: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  function encryptShowRandom(
    secret: number,
    publicKey: bigint,
    prime: bigint,
    generator: bigint
  ) {
    if (secret >= Number(prime)) {
      throw new Error("Message is too large for direct encryption");
    }
    const randomNumber = getRandomBigIntegerInRange(
      BigInt(1),
      prime - BigInt(1)
    );

    const c1 = modPow(generator, randomNumber, prime);
    const messageBigInt = BigInt(secret);
    const c2 = (modPow(publicKey, randomNumber, prime) * messageBigInt) % prime;

    return { encryptedMessage: { c1, c2 }, randomNumber };
  }
  function getRandomBigIntegerInRange(min: bigint, max: bigint) {
    const range = max - min + BigInt(1);
    // Determine the number of bits needed for the range
    const bitsNeeded = range.toString(2).length;
    // Generate a random bigint within the calculated bits
    let num = randomBigint(bitsNeeded);
    // Adjust the number to the range
    num = num % range;
    // Add the minimum to align with the desired range
    return min + num;
  }

  function randomBigint(bits: number): bigint {
    // Ensure bits is positive and greater than zero to avoid infinite loop
    if (bits <= 0) {
      throw new RangeError("Bit length must be greater than 0");
    }

    // Calculate the number of hexadecimal digits needed
    const hexDigits = Math.ceil(bits / 4);

    // The first hex digit must be between 8 and F (inclusive) to ensure the MSB is set
    const firstDigit = (8 + Math.floor(Math.random() * 8)).toString(16);

    // Generate the remaining hex digits randomly
    const remainingDigits = Array(hexDigits - 1)
      .fill(0)
      .map(() => Math.floor(Math.random() * 16).toString(16))
      .join("");

    // Combine, convert to BigInt, and return
    return BigInt(`0x${firstDigit}${remainingDigits}`);
  }
  // Helper function to fetch market data

  return {
    market,
    getMarket,
    decryptVotes,
    sendEncryptedVote,
    submitDecryptionShare,
    isLoading,
  };
}
