'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function InvoiceDetail() {
  const params = useParams();
  const id = decodeURIComponent(params.id as string);

  // Mock data based on ID
  const invoice = {
    id: id,
    date: 'Oct 24, 2023',
    client: 'Acme Corp',
    description: 'Frontend Architecture & Development for Q4. Includes design system implementation and Starknet integration.',
    amount: '1,250.00',
    role: 'Creator',
    status: id.includes('8f2') ? 'Awaiting Payment' : 'Settled',
    txHash: '0x0543...9a8b',
    decryptionKey: '0xabc123...def456',
    network: 'Starknet Mainnet'
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-24 md:py-32 w-full">
      <div className="max-w-5xl w-full space-y-16 animate-in fade-in duration-1000 ease-out">
        
        {/* Navigation */}
        <div>
          <Link href="/history" className="text-xs tracking-widest uppercase text-black/40 hover:text-black transition-colors">
            &larr; Back to History
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-4 border-b border-black pb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-light">Invoice Details</h1>
          <p className="font-mono text-sm text-black/60">{invoice.id}</p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column: Primary Info */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-4">
              <p className="text-xs tracking-widest uppercase text-black/40">Total Amount</p>
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-6xl md:text-7xl font-light">{invoice.amount}</span>
                <span className="text-sm tracking-widest uppercase text-black/40">STRK</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs tracking-widest uppercase text-black/40">Status</p>
              <div className="inline-flex items-center px-4 py-2 border border-black/10 rounded-full">
                {invoice.status === 'Settled' && <span className="w-2 h-2 rounded-full bg-black mr-3"></span>}
                {invoice.status === 'Awaiting Payment' && <span className="w-2 h-2 rounded-full border border-black/40 mr-3"></span>}
                <span className="text-sm tracking-widest uppercase">{invoice.status}</span>
              </div>
            </div>

            {invoice.status === 'Awaiting Payment' && invoice.role === 'Payer' && (
              <div className="pt-8">
                <Link 
                  href="/pay"
                  className="inline-block w-full text-center px-8 py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors"
                >
                  Proceed to Payment &rarr;
                </Link>
              </div>
            )}
            
            {invoice.status === 'Awaiting Payment' && invoice.role === 'Creator' && (
              <div className="pt-8">
                <button 
                  className="inline-block w-full text-center px-8 py-4 rounded-full border border-black/20 text-black text-sm tracking-wide hover:bg-black/5 transition-colors"
                >
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
              <SpecRow label="Decryption Key" value={invoice.decryptionKey} isMono />
              
              <div className="flex flex-col py-6 border-b border-black/10">
                <div className="text-xs tracking-widest uppercase text-black/40 mb-3">Description</div>
                <div className="font-light text-black/80 leading-relaxed">{invoice.description}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SpecRow({ label, value, isMono = false }: { label: string, value: string, isMono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-black/10">
      <div className="sm:w-1/3 text-xs tracking-widest uppercase text-black/40 mb-2 sm:mb-0 pt-1">{label}</div>
      <div className={`sm:w-2/3 ${isMono ? 'font-mono text-sm' : 'font-light'} text-black/80`}>{value}</div>
    </div>
  );
}
