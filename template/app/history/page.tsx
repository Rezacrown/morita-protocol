'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOCK_INVOICES = [
  { id: 'INV-0x8f2...11a', date: 'Oct 24, 2023', client: 'Acme Corp', amount: '1,250.00', role: 'Creator', status: 'Awaiting Payment' },
  { id: 'INV-0x3a1...9b2', date: 'Oct 12, 2023', client: 'Globex Inc', amount: '3,400.00', role: 'Creator', status: 'Settled' },
  { id: 'INV-0x7c4...4f5', date: 'Sep 28, 2023', client: 'Soylent Corp', amount: '850.00', role: 'Payer', status: 'Settled' },
  { id: 'INV-0x1e9...8d3', date: 'Sep 15, 2023', client: 'Initech', amount: '5,000.00', role: 'Payer', status: 'Settled' },
];

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInvoices = MOCK_INVOICES.filter(inv => {
    const matchesSearch = inv.id.toLowerCase().includes(search.toLowerCase()) || inv.client.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All' || inv.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-24 md:py-32 w-full">
      <div className="max-w-5xl w-full space-y-16">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light">Transaction History</h1>
          <p className="text-black/60 font-light">A cryptographic ledger of your created and settled invoices.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-black/10 pb-8">
          <div className="space-y-6 w-full md:w-auto">
            <div className="space-y-3">
              <p className="text-[10px] tracking-widest uppercase text-black/40">Role</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Creator', 'Payer'].map(role => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors ${
                      roleFilter === role 
                        ? 'bg-black text-white' 
                        : 'border border-black/20 text-black/60 hover:border-black/40'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] tracking-widest uppercase text-black/40">Status</p>
              <div className="flex flex-wrap gap-2">
                {['All', 'Settled', 'Awaiting Payment'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-colors ${
                      statusFilter === status 
                        ? 'bg-black text-white' 
                        : 'border border-black/20 text-black/60 hover:border-black/40'
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent border-b border-black/20 py-2 text-sm font-light focus:outline-none focus:border-black transition-colors placeholder:text-black/30"
            />
          </div>
        </div>

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
            {filteredInvoices.length === 0 ? (
              <div className="py-12 text-center text-black/40 font-light">
                No invoices match your criteria.
              </div>
            ) : (
              filteredInvoices.map((inv, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b border-black/10 items-center group hover:bg-black/[0.02] transition-colors">
                  <div className="col-span-2 text-sm font-light text-black/60 mb-1 md:mb-0">{inv.date}</div>
                  
                  <div className="col-span-3 font-mono text-sm mb-3 md:mb-0">
                    <Link href={`/history/${encodeURIComponent(inv.id)}`} className="hover:underline underline-offset-4 decoration-black/20">
                      {inv.id}
                    </Link>
                  </div>
                  
                  <div className="col-span-2 mb-2 md:mb-0">
                    <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] tracking-widest uppercase ${
                      inv.role === 'Creator' 
                        ? 'bg-black/5 text-black' 
                        : 'border border-black/20 text-black/60'
                    }`}>
                      {inv.role}
                    </span>
                  </div>
                  
                  <div className="col-span-2 mb-2 md:mb-0">
                    <span className={`inline-flex items-center text-xs tracking-widest uppercase ${
                      inv.status === 'Settled' ? 'text-black' : 'text-black/40'
                    }`}>
                      {inv.status === 'Settled' && <span className="w-1.5 h-1.5 rounded-full bg-black mr-2"></span>}
                      {inv.status === 'Awaiting Payment' && <span className="w-1.5 h-1.5 rounded-full border border-black/40 mr-2"></span>}
                      {inv.status}
                    </span>
                  </div>
                  
                  <div className="col-span-3 md:text-right font-serif text-xl md:text-2xl font-light">
                    {inv.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
