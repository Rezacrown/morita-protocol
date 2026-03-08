# Starknet Wallet

Kelola wallet Starknet untuk AI agents dengan native Account Abstraction support.

## Prerequisites

```bash
npm install starknet@^8.9.1 @avnu/avnu-sdk@^4.0.1
```

Environment variables:

```
STARKNET_RPC_URL=https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY
STARKNET_ACCOUNT_ADDRESS=0x...
STARKNET_PRIVATE_KEY=0x...
AVNU_PAYMASTER_URL=https://starknet.paymaster.avnu.fi (optional)
```

## MCP Tools

| Tool                       | Purpose                        |
| -------------------------- | ------------------------------ |
| `starknet_get_balance`     | Check single token balance     |
| `starknet_get_balances`    | Check multiple token balances  |
| `starknet_transfer`        | Send tokens (supports gasless) |
| `starknet_call_contract`   | Read contract state            |
| `starknet_invoke_contract` | Execute contract functions     |

## Check Balance

```typescript
import { RpcProvider, Contract } from "starknet";

const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });
const ethAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const balance = await ethContract.balanceOf(accountAddress);
```

## Transfer Tokens

```typescript
import {
  Account,
  RpcProvider,
  CallData,
  cairo,
  ETransactionVersion,
} from "starknet";

const account = new Account({
  provider,
  address: process.env.STARKNET_ACCOUNT_ADDRESS,
  signer: process.env.STARKNET_PRIVATE_KEY,
  transactionVersion: ETransactionVersion.V3,
});

const { transaction_hash } = await account.execute({
  contractAddress: tokenAddress,
  entrypoint: "transfer",
  calldata: CallData.compile({
    recipient: recipientAddress,
    amount: cairo.uint256(amountInWei),
  }),
});
```

## Estimate Fees

```typescript
const estimatedFee = await account.estimateInvokeFee({
  contractAddress: tokenAddress,
  entrypoint: "transfer",
  calldata: CallData.compile({
    recipient: recipientAddress,
    amount: cairo.uint256(amountInWei),
  }),
});
```

## Session Keys

Session keys memungkinkan agents untuk mengeksekusi transaksi tanpa persetujuan per-action:

1. Owner membuat session key dengan policies
2. Agent menggunakan session key untuk operasi otonom
3. Owner dapat mencabut kapan saja

Reference: [Cartridge Controller](https://docs.cartridge.gg/controller/getting-started)

## Referensi

- [starknet.js Documentation](https://www.starknetjs.com/)
- [Starknet Account Abstraction](https://www.starknet.io/blog/native-account-abstraction/)
- [avnu Paymaster](https://docs.avnu.fi/paymaster)
