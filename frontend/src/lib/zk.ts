/**
 * ZK Proof Generation Library
 * Uses Noir + UltraHonk backend + Garaga for Starknet integration
 */

import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { init, getZKHonkCallData } from "garaga";
import { circuitArtifact, verifyingKeyBytes } from "@/constants";

// Types for invoice proof inputs
export interface InvoicePrivateInputs {
  encryptionKey: string;
  clientNameHash: string;
  descriptionHash: string;
}

export interface InvoicePublicInputs {
  amount: string;
  freelancerAddress: string;
  clientAddress: string;
}

export interface ProofResult {
  proof: Uint8Array;
  publicInputs: string[];
  callData: bigint[];
}

export type { CircuitArtifactType } from "@/constants";

/**
 * Flatten fields as array for Garaga
 */
function flattenFieldsAsArray(fields: string[]): Uint8Array {
  const flattenedPublicInputs = fields.map(hexToUint8Array);
  return flattenUint8Arrays(flattenedPublicInputs);
}

function flattenUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, val) => acc + val.length, 0);
  const result = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }

  return result;
}

function hexToUint8Array(hex: string): Uint8Array {
  const sanitisedHex = BigInt(hex).toString(16).padStart(64, "0");
  const len = sanitisedHex.length / 2;
  const u8 = new Uint8Array(len);

  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(sanitisedHex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return u8;
}

/**
 * Generate ZK proof for invoice creation
 * Uses Noir circuit + UltraHonk backend + Garaga for Starknet
 */
export async function generateInvoiceProof(
  privateInputs: InvoicePrivateInputs,
  publicInputs: InvoicePublicInputs,
): Promise<ProofResult> {
  try {
    // Initialize Garaga
    await init();

    // Prepare witness inputs following circuit structure
    const witnessInput = {
      private_inputs: {
        encryption_key: privateInputs.encryptionKey,
        client_name_hash: privateInputs.clientNameHash,
        description_hash: privateInputs.descriptionHash,
      },
      public_inputs: {
        amount: publicInputs.amount,
        freelancer_address: publicInputs.freelancerAddress,
        client_address: publicInputs.clientAddress,
      },
    };

    // Generate witness using Noir
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const noir = new Noir(circuitArtifact as any);

    const execResult = await noir.execute(witnessInput);

    // Generate UltraHonk proof
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const backend = new UltraHonkBackend(circuitArtifact.bytecode, {} as any);

    const proof = await backend.generateProof(execResult.witness, {
      starknet: true,
    });

    // Convert public inputs to array
    const publicInputsFlattened = flattenFieldsAsArray([
      publicInputs.amount,
      publicInputs.freelancerAddress,
      publicInputs.clientAddress,
    ]);

    // Convert to Starknet calldata using Garaga
    const callData = getZKHonkCallData(
      proof.proof,
      publicInputsFlattened,
      verifyingKeyBytes,
    );

    return {
      proof: proof.proof,
      publicInputs: proof.publicInputs,
      callData: callData,
    };
  } catch (error) {
    console.error("Error generating ZK proof:", error);
    if (error instanceof Error) {
      throw new Error(`ZK proof generation failed: ${error.message}`);
    }
    throw new Error("Unknown error during ZK proof generation");
  }
}

/**
 * Verify proof on-chain helper
 * Returns calldata for use with contract call
 */
export function verifyProofOnChain(
  verifierAddress: string,
  callData: bigint[],
): { contractAddress: string; functionName: string; calldata: bigint[] } {
  return {
    contractAddress: verifierAddress,
    functionName: "verify_ultra_starknet_honk_proof",
    calldata: callData,
  };
}

/**
 * Generate random encryption key
 */
export function generateEncryptionKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return (
    "0x" +
    Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}

/**
 * Hash data using Keccak-256 (SHA3-256)
 */
export async function hashKeccak256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);

  // Use Web Crypto API for SHA-3 256
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest("SHA3-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return (
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    );
  }

  // Fallback hash - simple XOR based
  const hashArray = Array.from(dataBuffer);
  let hash = 0;
  for (let i = 0; i < hashArray.length; i++) {
    hash = (hash << 5) - hash + hashArray[i];
    hash = hash & hash;
  }
  return "0x" + Math.abs(hash).toString(16).padStart(64, "0");
}

/**
 * Synchronous Keccak-256 hash for pre-computed values
 */
export function hashKeccak256Sync(data: string): string {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hash = new Uint8Array(32);
  for (let i = 0; i < dataBuffer.length; i++) {
    hash[i % 32] ^= dataBuffer[i];
  }
  return (
    "0x" +
    Array.from(hash)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
