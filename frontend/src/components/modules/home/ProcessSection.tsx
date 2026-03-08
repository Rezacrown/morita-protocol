import { ProcessRow } from "@/components/shared/ProcessRow";

export function ProcessSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24 w-full">
      <div className="mb-16">
        <h2 className="text-xs tracking-widest uppercase text-black/40">
          The Architecture of Privacy
        </h2>
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
  );
}
