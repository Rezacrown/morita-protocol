'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PayInvoiceContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'unpaid' | 'paid'>('loading');
  const [isPaying, setIsPaying] = useState(false);
  
  // Mock invoice data
  const [invoiceData, setInvoiceData] = useState({
    clientName: 'Acme Corp',
    description: 'Frontend Development for Q3',
    amount: '1,250.00',
    payee: '0x049d...8f2a'
  });

  useEffect(() => {
    const checkStatus = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('unpaid');
    };
    
    checkStatus();
  }, []);

  const handlePay = async () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setStatus('paid');
    }, 2500);
  };

  if (status === 'loading') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-black/40 tracking-widest uppercase text-sm animate-pulse">Decrypting...</p>
      </div>
    );
  }

  if (status === 'paid') {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in duration-1000 ease-out">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl font-light">Settled</h2>
            <p className="text-black/60 font-light leading-relaxed">
              For privacy reasons, the details of this transaction are no longer visible. The cryptographic proof has been securely recorded.
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

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full">
        <div className="border border-black/10 p-12 space-y-12 bg-white">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-light tracking-wide">Invoice</h1>
            <p className="text-xs tracking-widest uppercase text-black/40">Awaiting Payment</p>
          </div>

          {/* Details */}
          <div className="space-y-8 border-y border-black/10 py-8">
            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">Billed to</p>
              <p className="font-light col-span-2">{invoiceData.clientName}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">Description</p>
              <p className="font-light col-span-2 leading-relaxed">{invoiceData.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <p className="text-xs tracking-widest uppercase text-black/40 col-span-1">Payee</p>
              <p className="font-mono text-sm text-black/60 col-span-2">
                {invoiceData.payee}
              </p>
            </div>
          </div>

          {/* Total & Action */}
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <p className="text-xs tracking-widest uppercase text-black/40 mb-1">Total Due</p>
              <div className="text-right">
                <span className="font-serif text-4xl font-light">{invoiceData.amount}</span>
                <span className="text-sm text-black/40 ml-2 uppercase tracking-widest">STRK</span>
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={isPaying}
              className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? 'Confirming...' : `Pay ${invoiceData.amount} STRK`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayInvoice() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <p className="text-black/40 tracking-widest uppercase text-sm animate-pulse">Loading...</p>
      </div>
    }>
      <PayInvoiceContent />
    </Suspense>
  );
}
