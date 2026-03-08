"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { InvoiceDetailCard, InvoiceDetail } from "@/components/modules/history";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  // Mock data based on ID
  const invoice: InvoiceDetail = {
    id: id,
    date: "Oct 24, 2023",
    client: "Acme Corp",
    description:
      "Frontend Architecture & Development for Q4. Includes design system implementation and Starknet integration.",
    amount: "1,250.00",
    role: "Creator",
    status: id.includes("8f2") ? "Awaiting Payment" : "Settled",
    txHash: "0x0543...9a8b",
    decryptionKey: "0xabc123...def456",
    network: "Starknet Mainnet",
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-24 md:py-32 w-full">
      <div className="max-w-5xl w-full space-y-16 animate-in fade-in duration-1000 ease-out">
        {/* Navigation */}
        <div>
          <Link
            href="/history"
            className="text-xs tracking-widest uppercase text-black/40 hover:text-black transition-colors"
          >
            &larr; Back to History
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-black pb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-light">
            Invoice Details
          </h1>
          <p className="font-mono text-sm text-black/60">{invoice.id}</p>
        </div>

        {/* Detail Card */}
        <InvoiceDetailCard invoice={invoice} />
      </div>
    </div>
  );
}
