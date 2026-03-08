"use client";

import Link from "next/link";

export interface PaymentPaidViewProps {
  onCreateInvoice?: () => void;
}

export function PaymentPaidView({}: PaymentPaidViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-1000 ease-out">
        <div className="space-y-4">
          <h2 className="font-serif text-4xl font-light">Payment Complete</h2>
          <p className="text-black/60 font-light leading-relaxed">
            For privacy reasons, the details of this transaction are no longer
            visible. The cryptographic proof has been securely recorded.
          </p>
        </div>

        <div className="pt-8 border-t border-black/10">
          <Link
            href="/create"
            className="inline-block px-8 py-4 rounded-full border border-black/20 text-black text-sm tracking-wide hover:bg-black/5 transition-colors"
          >
            Create Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
