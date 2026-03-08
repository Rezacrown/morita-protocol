'use client';

import { useState } from 'react';

export default function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const address = "0x049d...8f2a";

  return (
    <button 
      onClick={() => setIsConnected(!isConnected)}
      className={`px-6 py-2.5 rounded-full text-sm tracking-wide transition-colors ${
        isConnected 
          ? 'bg-transparent border border-black/20 text-black hover:bg-black/5 font-mono' 
          : 'bg-black text-white hover:bg-black/80'
      }`}
    >
      {isConnected ? address : 'Connect Wallet'}
    </button>
  );
}
