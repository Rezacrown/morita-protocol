"use client";

import { useState } from "react";
import {
  FormField,
  FormRow,
  SubmitButton,
  SuccessView,
} from "@/components/modules/create";

export default function CreateInvoice() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    // Mock encryption and contract call
    setTimeout(() => {
      const mockPayload = "eyJh...";
      const mockKey = "0xabc123...";
      setGeneratedUrl(
        `https://morita.app/pay?payload=${mockPayload}#key=${mockKey}`,
      );
      setStatus("success");
    }, 2000);
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
            Details are encrypted locally before hashing on-chain.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FormField label="Client Name">
            <input
              required
              type="text"
              placeholder="Acme Corp"
              className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
            />
          </FormField>

          <FormField label="Description of Services">
            <textarea
              required
              rows={1}
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
                step="0.01"
                placeholder="0.00"
                className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
              />
            </FormField>

            <FormField label="Receiving Wallet">
              <input
                required
                type="text"
                defaultValue="0x049d...8f2a"
                className="w-full bg-transparent border-b border-black/20 py-3 font-mono text-sm focus:outline-none focus:border-black transition-colors text-black/80"
              />
            </FormField>
          </FormRow>

          <SubmitButton isLoading={status === "loading"} />
        </form>
      </div>
    </div>
  );
}
