import Link from "next/link";

export function CTASection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-32 pt-16 w-full">
      <div className="border border-black p-12 md:p-24 flex flex-col items-center text-center relative bg-white">
        {/* Architectural Corner Marks */}
        <div className="absolute top-0 left-0 w-3 h-3 border-r border-b border-black bg-white -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-3 h-3 border-l border-b border-black bg-white translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-3 h-3 border-r border-t border-black bg-white -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-3 h-3 border-l border-t border-black bg-white translate-x-1/2 translate-y-1/2"></div>

        <h2 className="font-serif text-4xl md:text-5xl font-light mb-8">
          Ready to secure your billing?
        </h2>
        <Link
          href="/create"
          className="px-8 py-4 rounded-full bg-black text-white text-sm tracking-wide hover:bg-black/80 transition-colors"
        >
          Initialize Protocol &rarr;
        </Link>
      </div>
    </section>
  );
}
