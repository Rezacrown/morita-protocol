import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] text-black">
            Designed for Privacy,<br />
            Built for Business
          </h1>
          
          <p className="text-base md:text-lg text-black/60 max-w-2xl mx-auto leading-relaxed font-light">
            Discover beautifully crafted confidential invoicing. We make the process secure and private, so you can focus on bringing your business to life.
          </p>
          
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/create" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors w-full sm:w-auto"
            >
              Create Secret Invoice &rarr;
            </Link>
          </div>
        </div>

        <div className="w-full max-w-5xl mx-auto mt-32 relative">
          {/* Architectural / Blueprint style image */}
          <div className="relative aspect-[16/9] w-full bg-black/5 rounded-2xl overflow-hidden">
            <Image
              src="https://picsum.photos/seed/architecture/1920/1080?grayscale"
              alt="Architectural Blueprint"
              fill
              className="object-cover opacity-80 mix-blend-multiply"
              referrerPolicy="no-referrer"
            />
            {/* Grid overlay for blueprint feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="py-32 md:py-48 px-6 max-w-5xl mx-auto text-center">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
          "Financial privacy is not a luxury.<br/>
          <span className="italic text-black/40">It is the foundation of confident business.</span>"
        </h2>
      </section>

      {/* THE ARCHITECTURE OF PRIVACY */}
      <section className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="mb-16">
          <h2 className="text-xs tracking-widest uppercase text-black/40">The Architecture of Privacy</h2>
        </div>
        <div className="border-t border-black">
          <ProcessRow 
            num="01" 
            title="Encrypt" 
            desc="Invoice details are locked locally in your browser using AES-GCM. The plaintext never touches our servers."
          />
          <ProcessRow 
            num="02" 
            title="Commit" 
            desc="A cryptographic hash of the encrypted payload is anchored to Starknet, creating an immutable, timestamped proof."
          />
          <ProcessRow 
            num="03" 
            title="Reveal" 
            desc="The client unlocks the data via a secure URL fragment (#key) that is never transmitted to the network."
          />
        </div>
      </section>

      {/* THE FOUNDATION (SPECS) */}
      <section className="max-w-6xl mx-auto px-6 py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-4xl font-light">The Foundation</h2>
            <p className="mt-6 text-black/50 font-light leading-relaxed">
              Engineered for zero-knowledge environments. Our protocol ensures that your financial agreements remain strictly between you and your client.
            </p>
          </div>
          <div className="lg:col-span-7">
            <div className="border-t border-black/20">
              <SpecRow label="Network" value="Starknet (Layer 2)" />
              <SpecRow label="Smart Contracts" value="Cairo 1.0" />
              <SpecRow label="Encryption" value="AES-256-GCM (Client-side)" />
              <SpecRow label="Storage" value="On-chain Keccak256 Hashes" />
              <SpecRow label="Access Control" value="URL Fragment Decryption" />
            </div>
          </div>
        </div>
      </section>

      {/* SECONDARY CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-32 pt-16 w-full">
        <div className="border border-black p-12 md:p-24 flex flex-col items-center text-center relative bg-white">
          {/* Architectural Corner Marks */}
          <div className="absolute top-0 left-0 w-3 h-3 border-r border-b border-black bg-white -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-l border-b border-black bg-white translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-r border-t border-black bg-white -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-l border-t border-black bg-white translate-x-1/2 translate-y-1/2"></div>
          
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">Ready to secure your billing?</h2>
          <Link href="/create" className="px-8 py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors">
            Initialize Protocol &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}

function ProcessRow({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col md:flex-row py-12 md:py-16 border-b border-black/20 group hover:bg-black/[0.02] transition-colors">
      <div className="md:w-1/4 font-serif text-7xl md:text-8xl text-black/10 font-light group-hover:text-black transition-colors duration-500 leading-none mb-6 md:mb-0">
        {num}
      </div>
      <div className="md:w-1/4 pt-2">
        <h3 className="text-xs tracking-widest uppercase font-medium">{title}</h3>
      </div>
      <div className="md:w-2/4 pt-2">
        <p className="font-light text-black/60 leading-relaxed text-lg">{desc}</p>
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-black/10">
      <div className="sm:w-1/3 text-xs tracking-widest uppercase text-black/40 mb-2 sm:mb-0 pt-1">{label}</div>
      <div className="sm:w-2/3 font-mono text-sm text-black/80">{value}</div>
    </div>
  );
}
