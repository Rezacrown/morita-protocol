"use client";
import { mainnet, sepolia } from "@starknet-start/chains";
import { publicProvider } from "@starknet-start/providers";
import { StarknetConfig } from "@starknet-start/react";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const chains = [sepolia, mainnet];

  const provider = publicProvider();

  return (
    <StarknetConfig chains={chains} provider={provider}>
      {children}
    </StarknetConfig>
  );
}
