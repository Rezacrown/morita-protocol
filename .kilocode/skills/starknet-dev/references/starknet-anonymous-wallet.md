# Starknet Anonymous Wallet

Buat anonymous Starknet wallet via Typhoon dan interact dengan Starknet contracts. Privacy-focused wallet creation untuk agents yang memerlukan anonymity.

## Prerequisites

```bash
npm install starknet@^8.9.1 typhoon-sdk@^1.1.13
```

## Usage

```typescript
import { Typhoon } from "typhoon-sdk";

// Create anonymous wallet
const wallet = await Typhoon.createWallet({
  network: "mainnet", // or 'sepolia'
});

// Get wallet address
console.log("Anonymous wallet:", wallet.address);

// Sign transactions
const signature = await wallet.signMessage(message);
```

## Features

- **Privacy-focused**: No identity linking
- **Deterministic**: Same seed = same wallet
- **Multi-chain**: Support multiple networks
- **Session Keys**: Built-in session key management

## Referensi

- [Typhoon SDK Documentation](https://typhoon.network/)
- [Starknet Privacy](https://docs.starknet.io/)
