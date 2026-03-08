import type {Metadata} from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import ConnectWallet from '@/components/ConnectWallet';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ZkInvoice | Confidential B2B Invoicing',
  description: 'Confidential B2B Invoicing on Starknet',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white text-black font-sans min-h-screen flex flex-col antialiased selection:bg-black/10" suppressHydrationWarning>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl tracking-widest uppercase">ZkInvoice</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-black/60">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/create" className="hover:text-black transition-colors">Create</Link>
          <Link href="/history" className="hover:text-black transition-colors">History</Link>
        </nav>
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-center text-xs tracking-widest uppercase text-black/40">
      <p>Built for Re{'{'}define{'}'} Hackathon &mdash; Powered by Starknet</p>
    </footer>
  );
}
