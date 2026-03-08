"use client";

import Link from "next/link";
import { SpecRow } from "@/components/shared/SpecRow";

export interface InvoiceDetail {
  id: string;
  date: string;
  client: string;
  description: string;
  amount: string;
  role: "Creator" | "Payer";
  status: "Settled" | "Awaiting Payment";
  txHash: string;
  decryptionKey: string;
  network: string;
}

export interface InvoiceDetailCardProps {
  invoice: InvoiceDetail;
}

export function InvoiceDetailCard({ invoice }: InvoiceDetailCardProps) {
  return (
    <>
      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left Column: Primary Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase text-black/40">
              Total Amount
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-6xl md:text-7xl font-light">
                {invoice.amount}
              </span>
              <span className="text-sm tracking-widest uppercase text-black/40">
                STRK
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase text-black/40">
              Status
            </p>
            <div className="inline-flex items-center px-4 py-2 border border-black/10 rounded-full">
              {invoice.status === "Settled" && (
                <span className="w-2 h-2 rounded-full bg-black mr-3"></span>
              )}
              {invoice.status === "Awaiting Payment" && (
                <span className="w-2 h-2 rounded-full border border-black/40 mr-3"></span>
              )}
              <span className="text-sm tracking-widest uppercase">
                {invoice.status}
              </span>
            </div>
          </div>

          {invoice.status === "Awaiting Payment" &&
            invoice.role === "Payer" && (
              <div className="pt-8">
                <Link
                  href="/pay"
                  className="inline-block w-full text-center px-8 py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors"
                >
                  Proceed to Payment &rarr;
                </Link>
              </div>
            )}

          {invoice.status === "Awaiting Payment" &&
            invoice.role === "Creator" && (
              <div className="pt-8">
                <button className="inline-block w-full text-center px-8 py-4 rounded-full border border-black/20 text-black text-sm tracking-wide hover:bg-black/5 transition-colors">
                  Copy Payment Link
                </button>
              </div>
            )}
        </div>

        {/* Right Column: Specifications */}
        <div className="lg:col-span-7">
          <div className="border-t border-black/20">
            <SpecRow label="Date Created" value={invoice.date} />
            <SpecRow label="Client / Counterparty" value={invoice.client} />
            <SpecRow label="Role" value={invoice.role} />
            <SpecRow label="Network" value={invoice.network} />
            <SpecRow label="Transaction Hash" value={invoice.txHash} isMono />
            <SpecRow
              label="Decryption Key"
              value={invoice.decryptionKey}
              isMono
            />

            <div className="flex flex-col py-6 border-b border-black/10">
              <div className="text-xs tracking-widest uppercase text-black/40 mb-3">
                Description
              </div>
              <div className="font-light text-black/80 leading-relaxed">
                {invoice.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
