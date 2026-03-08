# starknet.js v9.x SDK

Panduan untuk membangun aplikasi Starknet menggunakan starknet.js v9.x SDK.

## Quick Start

```bash
npm install starknet
```

```typescript
import { RpcProvider, Contract } from "starknet";

const provider = await RpcProvider.create({
  nodeUrl: "https://rpc.starknet.lava.build",
});
const contract = new Contract(abi, contractAddress, provider);
const result = await contract.get_balance();
```

## Core Architecture

```
Provider -> Account -> Contract
   |          |          |
Network   Identity   Interaction
```

- **Provider**: Read-only network connection (RpcProvider)
- **Account**: Extends Provider dengan signing dan transaction capabilities
- **Contract**: Type-safe interface ke deployed contracts

## Provider Setup

```typescript
import { RpcProvider } from "starknet";

const provider = await RpcProvider.create({
  nodeUrl: "https://rpc.starknet.lava.build",
});
```

**Networks:**

- Mainnet: `https://rpc.starknet.lava.build`
- Sepolia: `https://rpc.starknet-testnet.lava.build`

## Account Creation

```typescript
import { hash, ec, encode, CallData, Account } from "starknet";

const privateKey =
  "0x" + encode.buf2hex(ec.starkCurve.utils.randomPrivateKey());
const publicKey = ec.starkCurve.getStarkKey(privateKey);

const classHash =
  "0x540d7f5ec7ecf317e68d48564934cb99259781b1ee3cedbbc37ec5337f8e688";
const constructorCalldata = CallData.compile({ publicKey });
const address = hash.calculateContractAddressFromHash(
  publicKey,
  classHash,
  constructorCalldata,
  0,
);

// Deploy
const account = new Account({
  provider,
  address,
  signer: privateKey,
  cairoVersion: "1",
});
const { transaction_hash } = await account.deployAccount({
  classHash,
  constructorCalldata,
  addressSalt: publicKey,
});
```

## Contract Interaction

### Read State

```typescript
const balance = await contract.balanceOf(userAddress);
```

### Write (Execute)

```typescript
const tx = await contract.increase_balance(100);
await provider.waitForTransaction(tx.transaction_hash);
```

### Multicall

```typescript
const calls = [
  {
    contractAddress: tokenAddress,
    entrypoint: "approve",
    calldata: CallData.compile({
      spender: bridgeAddress,
      amount: cairo.uint256(1000n),
    }),
  },
  {
    contractAddress: bridgeAddress,
    entrypoint: "deposit",
    calldata: CallData.compile({ amount: cairo.uint256(1000n) }),
  },
];

const tx = await account.execute(calls);
```

## Fee Estimation

```typescript
const fee = await account.estimateInvokeFee(calls);
console.log({
  overallFee: fee.overall_fee,
  resourceBounds: fee.resourceBounds,
});
```

## Paymaster (Gas Sponsorship)

```typescript
import { PaymasterRpc, Account } from "starknet";

const paymaster = new PaymasterRpc({
  nodeUrl: "https://sepolia.paymaster.avnu.fi",
});
const account = new Account({
  provider,
  address,
  signer: privateKey,
  paymaster,
});

// Sponsored (dApp pays gas)
const tx = await account.executePaymasterTransaction(calls, {
  feeMode: { mode: "sponsored" },
});

// Alternative token (e.g., USDC)
const feeDetails = { feeMode: { mode: "default", gasToken: USDC_ADDRESS } };
const tx = await account.executePaymasterTransaction(
  calls,
  feeDetails,
  estimate.suggested_max_fee_in_gas_token,
);
```

## CallData & Cairo Types

```typescript
import { CallData, cairo } from "starknet";

cairo.uint256(1000n); // { low, high } - use BigInt
cairo.felt252(1000); // BigInt
cairo.bool(true); // Cairo bool
cairo.byteArray("Hello"); // ByteArray for long strings
```

## Message Signing (SNIP-12)

```typescript
const typedData = {
  types: {
    StarknetDomain: [
      { name: "name", type: "shortstring" },
      { name: "version", type: "shortstring" },
      { name: "chainId", type: "shortstring" },
      { name: "revision", type: "shortstring" },
    ],
    Message: [{ name: "content", type: "shortstring" }],
  },
  primaryType: "Message",
  domain: {
    name: "MyDapp",
    version: "1",
    chainId: "SN_SEPOLIA",
    revision: "1",
  },
  message: { content: "Hello Starknet" },
};

const signature = await account.signMessage(typedData);
```

## Referensi

- [starknet.js Documentation](https://www.starknetjs.com/)
- [Starknet Documentation](https://docs.starknet.io/)
