import { SpecRow } from "@/components/shared/SpecRow";

export function FeatureSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-4xl font-light">The Foundation</h2>
          <p className="mt-6 text-black/50 font-light leading-relaxed">
            Engineered for zero-knowledge environments. Our protocol ensures
            that your financial agreements remain strictly between you and your
            client.
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
  );
}
