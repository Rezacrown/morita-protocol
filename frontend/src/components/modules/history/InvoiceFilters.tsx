"use client";

import { useState } from "react";

export interface InvoiceFiltersProps {
  onSearchChange?: (search: string) => void;
  onRoleFilterChange?: (role: string) => void;
  onStatusFilterChange?: (status: string) => void;
}

export function InvoiceFilters({
  onSearchChange,
  onRoleFilterChange,
  onStatusFilterChange,
}: InvoiceFiltersProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
  };

  const handleRoleFilterChange = (role: string) => {
    setRoleFilter(role);
    onRoleFilterChange?.(role);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    onStatusFilterChange?.(status);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-black/10 pb-8">
      <div className="space-y-6 w-full md:w-auto">
        <div className="space-y-3">
          <p className="text-[10px] tracking-widest uppercase text-black/40">
            Role
          </p>
          <div className="flex flex-wrap gap-2">
            {["All", "Creator", "Payer"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilterChange(role)}
                className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors ${
                  roleFilter === role
                    ? "bg-black text-white"
                    : "border border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] tracking-widest uppercase text-black/40">
            Status
          </p>
          <div className="flex flex-wrap gap-2">
            {["All", "Settled", "Awaiting Payment"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "border border-black/20 text-black/60 hover:border-black/40"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-72">
        <input
          type="text"
          placeholder="Search ID or Client..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-light focus:outline-none focus:border-black transition-colors placeholder:text-black/30"
        />
      </div>
    </div>
  );
}
