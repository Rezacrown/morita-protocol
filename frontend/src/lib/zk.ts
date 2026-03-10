import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { hash, num } from "starknet";

/**
 * Interface untuk input invoice
 */
interface InvoiceData {
  clientName: string;
  description: string;
  amount: string; // dalam satuan terkecil (Wei-like)
  payeeWallet: string;
  clientWallet: string;
  timestamp: string;
}

/**
 * Helper untuk mengubah string/teks menjadi Felt252 (Starknet standard)
 */
export function textToFelt(text: string): string {
  // Menggunakan TextEncoder (Native Browser) agar aman di sisi client-side Next.js
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  const hex =
    "0x" +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  // computeHashOnElements menerima array BigNumberish
  return hash.computeHashOnElements([num.toBigInt(hex)]).toString();
}

/**
 * TUGAS 1: Generate Invoice Hash
 * Mengikuti aturan sirkuit main.nr:
 * hash(client_name_hash, description_hash, amount, payee, client, timestamp)
 */
export async function generateInvoiceHash(data: InvoiceData): Promise<string> {
  const clientNameHash = textToFelt(data.clientName);
  const descriptionHash = textToFelt(data.description);

  // Menyusun elemen dan memanggil hash dalam satu langkah eksplisit untuk menghindari error TS
  const finalHash = hash.computeHashOnElements([
    num.toBigInt(clientNameHash),
    num.toBigInt(descriptionHash),
    num.toBigInt(data.amount),
    num.toBigInt(data.payeeWallet),
    num.toBigInt(data.clientWallet),
    num.toBigInt(data.timestamp),
  ]);

  return finalHash.toString();
}

/**
 * TUGAS 2: Generate Amount Commitment
 * Sesuai sirkuit: hash(amount, encryption_key[0])
 */
export async function generateAmountCommitment(
  amount: string,
  keyHex: string,
): Promise<string> {
  // Ambil byte pertama dari kunci hex
  const firstByte = parseInt(keyHex.substring(0, 2), 16).toString();

  // Fix Error: Gunakan array literal langsung di dalam argumen fungsi
  return hash
    .computeHashOnElements([num.toBigInt(amount), num.toBigInt(firstByte)])
    .toString();
}

/**
 * TUGAS 3: Generate ZK Proof
 */
export async function generateZKProof(
  privateInputs: {
    clientNameHash: string;
    descriptionHash: string;
    amount: string;
    encryptionKey: string;
  },
  publicInputs: {
    payeeWallet: string;
    clientWallet: string;
    timestamp: string;
    invoiceHash: string;
    amountCommitment: string;
  },
) {
  try {
    // 1. Load Circuit & Backend
    const response = await fetch("/artifacts/circuit.json");
    const circuit = await response.json();

    // Inisialisasi Backend untuk Proof Generation
    const backend = new BarretenbergBackend(circuit);

    // Inisialisasi Noir hanya dengan circuit (API Terbaru)
    const noir = new Noir(circuit);

    // 2. Format Encryption Key (Hex string to Array of numbers u8)
    const keyBytes =
      privateInputs.encryptionKey
        .match(/.{1,2}/g)
        ?.map((byte) => parseInt(byte, 16)) || [];
    if (keyBytes.length !== 32)
      throw new Error("Encryption key harus 32 bytes");

    // 3. Susun Witness Input
    const input = {
      client_name_hash: privateInputs.clientNameHash,
      description_hash: privateInputs.descriptionHash,
      amount: privateInputs.amount,
      encryption_key: keyBytes,

      payee_wallet: publicInputs.payeeWallet,
      client_wallet: publicInputs.clientWallet,
      timestamp: publicInputs.timestamp,
      invoice_hash: publicInputs.invoiceHash,
      amount_commitment: publicInputs.amountCommitment,
    };

    // 4. Generate Proof
    console.log("Generating ZK Proof... Proses ini berjalan di browser.");

    // Langkah 1: Generate Witness (menggunakan Noir class)
    const { witness } = await noir.execute(input);

    // Langkah 2: Generate Proof (menggunakan Backend class)
    const proofData = await backend.generateProof(witness);

    // Konversi hasil Uint8Array ke Array of Hex string (felt252) untuk Starknet
    return Array.from(proofData.proof).map(
      (byte) => "0x" + byte.toString(16).padStart(2, "0"),
    );
  } catch (error) {
    console.error("Gagal generate ZK Proof:", error);
    throw error;
  }
}

/**
 * Helper untuk format address agar konsisten
 */
export function formatAddress(addr: string): string {
  return num.toHex(num.toBigInt(addr));
}
