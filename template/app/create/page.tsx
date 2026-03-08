'use client';

import { useState } from 'react';

export default function CreateInvoice() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Mock encryption and contract call
    setTimeout(() => {
      const mockPayload = 'eyJh...';
      const mockKey = '0xabc123...';
      setGeneratedUrl(`https://zkinvoice.app/pay?payload=${mockPayload}#key=${mockKey}`);
      setStatus('success');
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
  };

  if (status === 'success') {
    return (
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center space-y-12 animate-in fade-in duration-1000 ease-out">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl font-light">Invoice Secured</h2>
            <p className="text-black/60 font-light">
              The cryptographic proof has been recorded on Starknet.
            </p>
          </div>

          <div className="border border-black/10 p-6 rounded-2xl text-left bg-black/5">
            <p className="text-sm text-black/80 leading-relaxed font-light">
              <strong className="font-medium">Important:</strong> We do not store this data. Copy and save this secure link to send to your client.
            </p>
          </div>

          <div className="space-y-4">
            <input 
              type="text" 
              readOnly 
              value={generatedUrl}
              className="w-full bg-transparent border-b border-black/20 py-4 text-sm font-mono text-black/60 focus:outline-none text-center"
            />
            <button 
              onClick={copyToClipboard}
              className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors"
            >
              Copy Secure Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        <div className="mb-16 text-center space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl font-light">Create Invoice</h1>
          <p className="text-black/60 font-light">Details are encrypted locally before hashing on-chain.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-black/40">Client Name</label>
            <input 
              required
              type="text" 
              placeholder="Acme Corp"
              className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs tracking-widest uppercase text-black/40">Description of Services</label>
            <textarea 
              required
              rows={1}
              placeholder="Frontend Development"
              className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light resize-none placeholder:text-black/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-black/40">Amount Due (STRK)</label>
              <input 
                required
                type="number" 
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-black transition-colors font-light placeholder:text-black/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-widest uppercase text-black/40">Receiving Wallet</label>
              <input 
                required
                type="text" 
                defaultValue="0x049d...8f2a"
                className="w-full bg-transparent border-b border-black/20 py-3 font-mono text-sm focus:outline-none focus:border-black transition-colors text-black/80"
              />
            </div>
          </div>

          <div className="pt-12">
            <button 
              disabled={status === 'loading'}
              type="submit"
              className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Processing...' : 'Sign & Encrypt Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
