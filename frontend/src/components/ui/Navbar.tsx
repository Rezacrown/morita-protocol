import Link from "next/link";
import ConnectWallet from "../ConnectWallet";

export default function Navbar() {
  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl tracking-widest uppercase">
            Morita
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-black/60">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <Link href="/create" className="hover:text-black transition-colors">
            Create
          </Link>
          <Link href="/history" className="hover:text-black transition-colors">
            History
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
