"use client";

import { useState } from "react";
import {
  InvoiceFilters,
  InvoiceTable,
  Invoice,
} from "@/components/modules/history";

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-0x8f2...11a",
    date: "Oct 24, 2023",
    client: "Acme Corp",
    amount: "1,250.00",
    role: "Creator",
    status: "Awaiting Payment",
  },
  {
    id: "INV-0x3a1...9b2",
    date: "Oct 12, 2023",
    client: "Globex Inc",
    amount: "3,400.00",
    role: "Creator",
    status: "Settled",
  },
  {
    id: "INV-0x7c4...4f5",
    date: "Sep 28, 2023",
    client: "Soylent Corp",
    amount: "850.00",
    role: "Payer",
    status: "Settled",
  },
  {
    id: "INV-0x1e9...8d3",
    date: "Sep 15, 2023",
    client: "Initech",
    amount: "5,000.00",
    role: "Payer",
    status: "Settled",
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || inv.role === roleFilter;
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-24 md:py-32 w-full">
      <div className="max-w-5xl w-full space-y-16">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light">
            Transaction History
          </h1>
          <p className="text-black/60 font-light">
            A cryptographic ledger of your created and settled invoices.
          </p>
        </div>

        {/* Filters */}
        <InvoiceFilters
          onSearchChange={setSearch}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Table */}
        <InvoiceTable invoices={filteredInvoices} />
      </div>
    </div>
  );
}
