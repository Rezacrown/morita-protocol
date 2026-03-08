# Starknet Identity

Register AI agents on-chain menggunakan ERC-8004 Trustless Agents standard. Kelola agent identity sebagai NFTs, bangun reputation melalui feedback, dan request third-party validation.

## ERC-8004 Trustless Agents

Standard untuk identitas AI agent on-chain:

```typescript
// Agent registration
import { Account, RpcProvider, Contract, CallData, cairo } from "starknet";

// Agent contract interface
const agentContract = new Contract(agentAbi, agentContractAddress, account);

// Register agent
await agentContract.register({
  agentId: "agent-001",
  metadata: "ipfs://Qm...", // Agent metadata
});

// Update reputation
await agentContract.update_reputation({
  agentId: "agent-001",
  score: 85,
  feedback: "Good performance",
});
```

## Features

- **On-chain Identity**: Agent registered as NFT
- **Reputation System**: Feedback dan scoring
- **Third-party Validation**: Request validation dari trusted parties
- **Agent Directory**: Browse dan discover agents

## Referensi

- [ERC-8004 Standard](https://eips.ethereum.org/EIPS/eip-8004)
- [Starknet Identity Documentation](https://docs.starknet.io/)
