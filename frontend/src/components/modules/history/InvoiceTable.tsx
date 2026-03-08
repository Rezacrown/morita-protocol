"use client";

import Link from "next/link";

export interface Invoice {
  id: string;
  date: string;
  client: string;
  amount: string;
  role: "Creator" | "Payer";
  status: "Settled" | "Awaiting Payment";
}

export interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="py-12 text-center text-black/40 font-light">
        No invoices match your criteria.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-black text-xs tracking-widest uppercase text-black/40">
        <div className="col-span-2">Date</div>
        <div className="col-span-3">Invoice ID</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Amount (STRK)</div>
      </div>

      {/* Data Rows */}
      <div className="flex flex-col">
        {invoices.map((inv, i) => (
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-black/10 items-center group hover:bg-black/[0.02] transition-colors"
          >
            <div className="col-span-2 text-sm font-light text-black/60 mb-1 md:mb-0">
              {inv.date}
            </div>

            <div className="col-span-3 font-mono text-sm mb-3 md:mb-0">
              <Link
                href={`/history/${encodeURIComponent(inv.id)}`}
                className="hover:underline underline-offset-4 decoration-black/20"
              >
                {inv.id}
              </Link>
            </div>

            <div className="col-span-2 mb-2 md:mb-0">
              <span
                className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] tracking-widest uppercase ${
                  inv.role === "Creator"
                    ? "bg-black/5 text-black"
                    : "border border-black/20 text-black/60"
                }`}
              >
                {inv.role}
              </span>
            </div>

            <div className="col-span-2 mb-2 md:mb-0">
              <span
                className={`inline-flex items-center text-xs tracking-widest uppercase ${
                  inv.status === "Settled" ? "text-black" : "text-black/40"
                }`}
              >
                {inv.status === "Settled" && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black mr-2"></span>
                )}
                {inv.status === "Awaiting Payment" && (
                  <span className="w-1.5 h-1.5 rounded-full border border-black/40 mr-2"></span>
                )}
                {inv.status}
              </span>
            </div>

            <div className="col-span-3 md:text-right font-serif text-xl md:text-2xl font-light">
              {inv.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
