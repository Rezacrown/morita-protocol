# StarkZap SDK

Integrasi dan maintenance untuk aplikasi yang dibangun dengan keep-starknet-strange/starkzap. Mencakup StarkSDK setup, onboarding (Signer/Privy/Cartridge), wallet lifecycle, sponsored transactions, ERC20 transfers, staking flows, tx builder batching.

## Prerequisites

```bash
npm install @starkzap/sdk
```

## Setup

```typescript
import { StarkZap } from "@starkzap/sdk";

const starkzap = new StarkZap({
  network: "mainnet",
  rpcUrl: process.env.STARKNET_RPC_URL,
});
```

## Onboarding

### Signer

```typescript
import { Signer } from "@starkzap/sdk";

const signer = new Signer({
  privateKey: process.env.PRIVATE_KEY,
});

// Sign message
const signature = await signer.signMessage(message);
```

### Privy

```typescript
import { Privy } from "@starkzap/sdk";

const privy = new Privy({
  appId: "your-app-id",
});

// Create wallet
const wallet = await privy.createWallet();
```

### Cartridge

```typescript
import { Cartridge } from '@starkzap/sdk';

const cartridge = new Cartridge({
  controller: '0x...',
});

// Create session
const session = await cartridge.createSession({
  policies: [...],
});
```

## Wallet Lifecycle

```typescript
// Create wallet
const wallet = await starkzap.createWallet();

// Deploy account
await wallet.deploy();

// Get address
console.log("Address:", wallet.address);

// Sign transaction
await wallet.sign(transaction);
```

## Sponsored Transactions

```typescript
import { Paymaster } from "@starkzap/sdk";

const paymaster = new Paymaster({
  url: "https://starknet.paymaster.avnu.fi",
});

// Execute with paymaster
const tx = await wallet.execute(transaction, {
  paymaster: true,
  gasToken: "USDC", // Pay gas in USDC
});
```

## ERC20 Transfers

```typescript
// Transfer tokens
await wallet.transfer({
  token: "0xTOKEN_ADDRESS",
  recipient: "0xRECIPIENT",
  amount: BigInt(1000000),
});
```

## Staking

```typescript
import { Staking } from "@starkzap/sdk";

const staking = new Staking({
  network: "mainnet",
});

// Stake STRK
await staking.stake({
  amount: BigInt(1000000000000000000),
});

// Claim rewards
await staking.claimRewards();
```

## Tx Builder Batching

```typescript
// Build multiple calls
const calls = await wallet.buildCalls([
  {
    contract: tokenAddress,
    entrypoint: 'approve',
    calldata: [spender, amount],
  },
  {
    contract: routerAddress,
    entrypoint: 'swap',
    calldata: [...],
  },
]);

// Execute batch
await wallet.execute(calls);
```

## Referensi

- [StarkZap Documentation](https://starkzap.io/docs/)
- [Keep Starknet Strange](https://github.com/keep-starknet-strange)
