"use client";

interface SuccessViewProps {
  generatedUrl: string;
  onCopy: () => void;
}

export function SuccessView({ generatedUrl, onCopy }: SuccessViewProps) {
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
            <strong className="font-medium">Important:</strong> We do not store
            this data. Copy and save this secure link to send to your client.
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
            onClick={onCopy}
            className="w-full py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors"
          >
            Copy Secure Link
          </button>
        </div>
      </div>
    </div>
  );
}
