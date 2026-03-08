"use client";

import { SpecRow } from "@/components/shared/SpecRow";

export interface InvoicePaymentData {
  clientName: string;
  description: string;
  amount: string;
  payee: string;
}

export interface InvoicePaymentCardProps {
  invoice: InvoicePaymentData;
  isPaying: boolean;
  onPay: () => void;
}

export function InvoicePaymentCard({
  invoice,
  isPaying,
  onPay,
}: InvoicePaymentCardProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full">
        <div className="border border-black/10 p-12 space-y-12 bg-white">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-light tracking-wide">
              Invoice
            </h1>
            <p className="text-xs tracking-widest uppercase text-black/40">
              Awaiting Payment
            </p>
          </div>

          {/* Details */}
          <div className="space-y-8 border-y border-black/10 py-8">
            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">
                Billed to
              </p>
              <p className="font-light col-span-2">{invoice.clientName}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">
                Description
              </p>
              <p className="font-light col-span-2 leading-relaxed">
                {invoice.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">
                Payee
              </p>
              <p className="font-mono text-sm text-black/60 col-span-2">
                {invoice.payee}
              </p>
            </div>
          </div>

          {/* Total & Action */}
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <p className="text-xs tracking-widest uppercase text-black/40 mb-1">
                Total Due
              </p>
              <div className="text-right">
                <span className="font-serif text-4xl font-light">
                  {invoice.amount}
                </span>
                <span className="text-sm text-black/40 ml-2 uppercase tracking-widest">
                  STRK
                </span>
              </div>
            </div>

            <button
              onClick={onPay}
              disabled={isPaying}
              className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? "Confirming..." : `Pay ${invoice.amount} STRK`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
