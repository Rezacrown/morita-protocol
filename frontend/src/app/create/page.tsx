"use client";

import { useState } from "react";
import { CallData, cairo, byteArray } from "starknet";
import { useAccount, useContract } from "@starknet-start/react";
import {
  FormField,
  FormRow,
  SubmitButton,
  SuccessView,
} from "@/components/modules/create";
import { MORITA_CONTRACT_ADDRESS } from "@/constants";
import {
  generateInvoiceHash,
  generateAmountCommitment,
  encryptData,
  generateEncryptionKey,
} from "@/lib/zk";

export default function CreateInvoice() {
  const { address, isConnected } = useAccount();
  const { contract } = useContract({
    abi: [
      {
        type: "function",
        name: "create_invoice",
        inputs: [
          { name: "invoice_hash", type: "core::felt252" },
          { name: "amount_commitment", type: "core::felt252" },
          {
            name: "payee",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "client_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
          { name: "amount", type: "core::integer::u256" },
          { name: "due_date", type: "core::integer::u64" },
          { name: "encrypted_payload", type: "core::byte_array::ByteArray" },
        ],
        outputs: [],
        state_mutability: "external",
      },
    ],
    address: MORITA_CONTRACT_ADDRESS,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [generatedUrl, setGeneratedUrl] = useState("");

  // Form states
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [amountStrk, setAmountStrk] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi wallet connection
    if (!isConnected || !address) {
      alert("Mohon hubungkan wallet Anda terlebih dahulu!");
      return;
    }

    setStatus("loading");

    try {
      // 1. Format Data & Timestamp
      const amountInWei = BigInt(
        Math.floor(parseFloat(amountStrk) * 10 ** 18),
      ).toString();
      const currentTimestamp = Math.floor(Date.now() / 1000).toString();
      const dueDate = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 hari

      // 2. Generate Encryption Key dari kombinasi address user dan client
      // Sesuai expectation: "encrypted jadi satu string dengan menggunakan address si user dan juga si client sebagai key"
      const normalizedClientAddress = clientAddress
        .toLowerCase()
        .startsWith("0x")
        ? clientAddress
        : `0x${clientAddress}`;
      const encryptionKey = `${address}:${normalizedClientAddress}:${currentTimestamp}`;

      // 3. Susun Payload untuk di-encrypt
      const payloadToEncrypt = JSON.stringify({
        clientName,
        description,
        timestamp: currentTimestamp,
      });

      // 4. Encrypt payload menggunakan fungsi dari @/lib/zk.ts
      const encryptedPayload = encryptData(payloadToEncrypt, encryptionKey);

      // 5. Komputasi Invoice Hash dan Amount Commitment menggunakan fungsi dari @/lib/zk.ts
      const invoiceHash = await generateInvoiceHash({
        clientName,
        description,
        amount: amountInWei,
        payeeWallet: address,
        clientWallet: normalizedClientAddress,
        timestamp: currentTimestamp,
      });

      const amountCommitment = await generateAmountCommitment(
        amountInWei,
        encryptionKey,
      );

      // 6. Susun Calldata untuk Contract
      const calldata = CallData.compile({
        invoice_hash: invoiceHash,
        amount_commitment: amountCommitment,
        payee: address,
        client_wallet: normalizedClientAddress,
        amount: cairo.uint256(amountInWei),
        due_date: BigInt(dueDate),
        encrypted_payload: byteArray.byteArrayFromString(encryptedPayload),
      });

      // 7. Eksekusi Transaksi
      console.log("Memanggil create_invoice pada contract...");
      if (!contract) {
        throw new Error("Contract tidak tersedia");
      }

      // Panggil fungsi create_invoice
      // @ts-ignore - Contract type dari useContract mungkin tidak lengkap
      const tx = await contract.create_invoice(calldata);
      console.log("Transaksi Terkirim! Hash:", tx.transaction_hash);

      // 8. Generate Link Pembayaran
      // Sesuai expectation: "/pay?invoice=[encrypted string]&keyid=[random key number dari smart contract]"
      // Kita menggunakan invoiceHash sebagai identifier dan timestamp sebagai keyid
      const finalLink = `${window.location.origin}/pay?invoice=${encryptedPayload}&keyid=${currentTimestamp}`;
      setGeneratedUrl(finalLink);
      setStatus("success");
    } catch (error) {
      console.error("Error saat membuat invoice:", error);
      alert(
        "Gagal membuat invoice. Transaksi dibatalkan atau terjadi kesalahan.",
      );
      setStatus("idle");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
  };

  if (status === "success") {
    return <SuccessView generatedUrl={generatedUrl} onCopy={copyToClipboard} />;
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        <div className="mb-16 text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light">
            Create Invoice
          </h1>
          <p className="text-black/60 font-light">
            Details are encrypted using your wallet address before hashing
            on-chain.
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-8 text-center">
            <svg
              className="w-16 h-16 text-orange-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-orange-900 mb-2">
              Wallet Tidak Terhubung
            </h3>
            <p className="text-orange-700 mb-4">
              Anda harus menghubungkan wallet terlebih dahulu untuk membuat
              invoice.
            </p>
            <p className="text-sm text-orange-600">
              Silakan klik tombol "Connect Wallet" di pojok kanan atas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField label="Client Name">
              <input
                required
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
              />
            </FormField>

            <FormField label="Description of Services">
              <textarea
                required
                rows={1}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Frontend Development"
                className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light resize-none placeholder:text-black/20"
              />
            </FormField>

            <FormRow>
              <FormField label="Amount Due (STRK)">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.000000000000000001"
                  value={amountStrk}
                  onChange={(e) => setAmountStrk(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
                />
              </FormField>

              <FormField label="Client Wallet Address">
                <input
                  required
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-transparent border-b border-black/20 py-3 font-mono text-sm focus:outline-none focus:border-black transition-colors text-black/80"
                />
              </FormField>
            </FormRow>

            <SubmitButton isLoading={status === "loading"} />
          </form>
        )}
      </div>
    </div>
  );
}
