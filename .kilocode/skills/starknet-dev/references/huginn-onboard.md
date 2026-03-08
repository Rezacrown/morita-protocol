# Huginn Onboard

Bridge ke Starknet dari EVM chain manapun dan register dengan Huginn agent registry. Enables cross-chain agent onboarding dengan AVNU bridge integration.

## Prerequisites

```bash
# Install Huginn
curl -L https://raw.githubusercontent.com/huginn/huginn/main/scripts/install.sh | sh
```

## Usage

### Bridge dari EVM ke Starknet

```typescript
import { Bridge } from "@huginn/bridge";

// Bridge ETH dari Ethereum ke Starknet
const bridge = new Bridge({
  sourceChain: "ethereum",
  targetChain: "starknet",
});

const tx = await bridge.deposit({
  token: "ETH",
  amount: "1000000000000000000", // 1 ETH
  recipient: starknetAddress,
});
```

### Register dengan Huginn

```typescript
import { Huginn } from "@huginn/sdk";

const huginn = new Huginn({
  network: "mainnet",
});

// Register agent
await huginn.registerAgent({
  name: "My Agent",
  metadata: {
    capabilities: ["defi", "trading"],
    version: "1.0.0",
  },
});
```

## Features

- **Cross-chain Bridge**: Dari Ethereum/Polygon/Arbitrum ke Starknet
- **Agent Registry**: Register dan discover AI agents
- **AVNU Integration**: Best-price bridge routing
- **Multi-chain Support**: EVM ke Starknet

## Referensi

- [Huginn Documentation](https://docs.huginn.io/)
- [AVNU Bridge](https://docs.avnu.fi/)
