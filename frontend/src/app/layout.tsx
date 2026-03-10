import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { StarknetProvider } from "@/components/starknet-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Morita | Confidential B2B Invoicing",
  description: "Confidential B2B Invoicing on Starknet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="bg-white text-black font-sans min-h-screen flex flex-col antialiased selection:bg-black/10"
        suppressHydrationWarning
      >
        <StarknetProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </StarknetProvider>
      </body>
    </html>
  );
}
