# Starknet DeFi

Execute DeFi operations pada Starknet menggunakan avnu aggregator dan native protocols.

## Prerequisites

```bash
npm install starknet@^8.9.1 @avnu/avnu-sdk@^4.0.1
```

## Token Swaps (avnu SDK v4)

### Get Quote and Execute Swap

```typescript
import { getQuotes, executeSwap } from "@avnu/avnu-sdk";
import { Account, RpcProvider } from "starknet";

const provider = new RpcProvider({ nodeUrl: process.env.STARKNET_RPC_URL });
const account = new Account({ provider, address, signer: privateKey });

const eth = await fetchVerifiedTokenBySymbol("ETH");
const strk = await fetchVerifiedTokenBySymbol("STRK");

const quotes = await getQuotes({
  sellTokenAddress: eth.address,
  buyTokenAddress: strk.address,
  sellAmount: BigInt(10 ** 17),
  takerAddress: account.address,
});

const bestQuote = quotes[0];

const result = await executeSwap({
  provider: account,
  quote: bestQuote,
  slippage: 0.01,
  executeApprove: true,
});
```

### Gasless Swap

```typescript
import { PaymasterRpc } from "starknet";

const paymaster = new PaymasterRpc({
  nodeUrl: "https://starknet.paymaster.avnu.fi",
});

const result = await executeSwap({
  provider: account,
  quote: bestQuote,
  slippage: 0.01,
  executeApprove: true,
  paymaster: {
    active: true,
    provider: paymaster,
    params: {
      feeMode: {
        mode: "default",
        gasToken:
          "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8", // USDC
      },
    },
  },
});
```

## DCA (Dollar Cost Averaging)

```typescript
import { executeCreateDca } from "@avnu/avnu-sdk";
import moment from "moment";

const dcaOrder = {
  sellTokenAddress: usdcAddress,
  buyTokenAddress: strkAddress,
  totalAmount: parseUnits("100", 6),
  numberOfOrders: 10,
  frequency: moment.duration(1, "day"),
  startAt: Math.floor(Date.now() / 1000),
};

await executeCreateDca({
  provider: account,
  order: dcaOrder,
});
```

## STRK Staking

### Stake STRK

```typescript
import { executeStake, getAvnuStakingInfo } from "@avnu/avnu-sdk";

const stakingInfo = await getAvnuStakingInfo();

await executeStake({
  provider: account,
  poolAddress: stakingInfo.pools[0].address,
  amount: parseUnits("100", 18),
});
```

### Claim Rewards

```typescript
import { executeClaimRewards } from "@avnu/avnu-sdk";

await executeClaimRewards({
  provider: account,
  poolAddress: poolAddress,
  restake: true,
});
```

### Unstake

```typescript
import { executeInitiateUnstake, executeUnstake } from "@avnu/avnu-sdk";

// Initiate (starts cooldown -- 21 days)
await executeInitiateUnstake({
  provider: account,
  poolAddress: poolAddress,
  amount: parseUnits("50", 18),
});

// Complete after cooldown
await executeUnstake({
  provider: account,
  poolAddress: poolAddress,
});
```

## Protocol Reference

| Protocol     | Operations                     | Notes                 |
| ------------ | ------------------------------ | --------------------- |
| **avnu**     | Swap aggregation, DCA, gasless | Best-price routing    |
| **Ekubo**    | AMM, concentrated liquidity    | Highest TVL           |
| **JediSwap** | AMM, classic pools             | V2 with CL            |
| **zkLend**   | Lending, borrowing             | Variable/stable rates |
| **Nostra**   | Lending, borrowing             | Multi-asset pools     |

## Referensi

- [avnu SDK Documentation](https://docs.avnu.fi/)
- [Ekubo Protocol](https://docs.ekubo.org/)
- [zkLend Documentation](https://docs.zklend.com/)
