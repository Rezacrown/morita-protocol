"use client";
import Link from "next/link";
import {
  ManifestoSection,
  ProcessSection,
  FeatureSection,
  CTASection,
} from "@/components/modules/home";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[1.1] text-black">
            Designed for Privacy,
            <br />
            Built for Business
          </h1>

          <p className="text-base md:text-lg text-black/60 max-w-2xl mx-auto leading-relaxed font-light">
            Discover beautifully crafted confidential invoicing. We make the
            process secure and private, so you can focus on bringing your
            business to life.
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
      </section>

      {/* MANIFESTO SECTION */}
      <ManifestoSection />

      {/* PROCESS SECTION - The Architecture of Privacy */}
      <ProcessSection />

      {/* FEATURE SECTION - The Foundation */}
      <FeatureSection />

      {/* CTA SECTION */}
      <CTASection />
    </div>
  );
}
