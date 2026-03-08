---
name: starknet-dev
description: Skill komprehensif untuk development Starknet — mencakup Cairo contracts, deployment, testing, optimization, security, wallet management, DeFi, identity, dan integrasi SDK. Gunakan skill ini untuk semua tugas terkait Starknet.
---

# Starknet Developer

Skill komprehensif untuk development Starknet yang mengkonsolidasikan semua aspek pengembangan — dari penulisan kontrak Cairo hingga deployment, testing, optimization, security, wallet management, DeFi, dan integrasi SDK.

## Ringkasan

Skill ini menyediakan panduan lengkap untuk mengembangkan aplikasi di Starknet, mencakup:

- **Cairo Contracts**: Penulisan smart contract Cairo dengan struktur, storage, events, interfaces, dan pola OpenZeppelin v3
- **Cairo Deployment**: Deployment kontrak menggunakan sncast, setup akun, konfigurasi network
- **Cairo Testing**: Pengujian kontrak dengan snforge, cheatcodes, fuzzing, fork testing
- **Cairo Optimization**: Optimasi performa kontrak, BoundedInt patterns, arithmetic efisien
- **Cairo Security**: Security patterns, audit checklist, vulnerabilitas umum
- **Wallet Management**: Pembuatan dan pengelolaan wallet, session keys, gasless transactions
- **DeFi Operations**: Token swaps, DCA, staking, lending
- **Identity**: ERC-8004 Trustless Agents standard untuk identitas on-chain
- **SDK Integration**: starknet.js v9.x untuk dApps

## Prasyarat

### Environment Variables

```bash
# Required
export STARKNET_RPC_URL="https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY"
export STARKNET_ACCOUNT_ADDRESS="0x..."
export STARKNET_PRIVATE_KEY="0x..."

# Optional: Untuk gasless transactions
export AVNU_PAYMASTER_URL="https://starknet.paymaster.avnu.fi"
export AVNU_PAYMASTER_API_KEY="your_key"
```

### Dependencies

```bash
# TypeScript (wallet, defi, identity, starknet-js)
npm install starknet@^9.2.1 @avnu/avnu-sdk@^4.0.1

# Python (mini-pay)
pip install starknet-py qrcode[pil] python-telegram-bot

# Cairo tools
# - Scarb (Cairo package manager)
# - Starknet Foundry (sncast, snforge)
```

## Topics Covered

### Cairo Development

| Topic                                                    | Deskripsi                                                                   |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| [cairo-contracts](./references/cairo-contracts.md)       | Contract structure, storage, events, interfaces, components, OZ v3 patterns |
| [cairo-deploy](./references/cairo-deploy.md)             | sncast commands, account setup, declare/deploy workflow                     |
| [cairo-testing](./references/cairo-testing.md)           | snforge tests, cheatcodes, event testing, fuzzing                           |
| [cairo-optimization](./references/cairo-optimization.md) | Performance optimization, BoundedInt, gas-efficient arithmetic              |
| [cairo-security](./references/cairo-security.md)         | Security patterns, audit checklist, common vulnerabilities                  |

### Starknet Operations

| Topic                                                                  | Deskripsi                                                     |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [starknet-wallet](./references/starknet-wallet.md)                     | Wallet creation, transfers, session keys, account abstraction |
| [starknet-defi](./references/starknet-defi.md)                         | Token swaps, DCA, staking, lending via AVNU                   |
| [starknet-identity](./references/starknet-identity.md)                 | ERC-8004 identity, agent reputation, on-chain registration    |
| [starknet-mini-pay](./references/starknet-mini-pay.md)                 | P2P payments, QR codes, Telegram bot                          |
| [starknet-anonymous-wallet](./references/starknet-anonymous-wallet.md) | Anonymous wallet via Typhoon                                  |
| [starknet-js](./references/starknet-js.md)                             | starknet.js v9.x SDK, dApps, transactions                     |

### Advanced Topics

| Topic                                            | Deskripsi                                                |
| ------------------------------------------------ | -------------------------------------------------------- |
| [controller-cli](./references/controller-cli.md) | Cartridge Controller CLI, session keys, scoped execution |
| [huginn-onboard](./references/huginn-onboard.md) | Bridge dari EVM ke Starknet, Huginn registration         |
| [starkzap-sdk](./references/starkzap-sdk.md)     | StarkSDK integration, sponsored transactions             |

## Contoh Penggunaan

### Deploy Kontrak Cairo

```bash
# Declare contract
sncast declare --contract-name MyContract --max-fee 1000000000000000

# Deploy contract
sncast deploy --class-hash <CLASS_HASH> --max-fee 1000000000000000
```

### Interaksi Wallet

```typescript
import { Account, ec, json } from 'starknet';

// Create account
const privateKey = ec.starkCurve.utils.randomPrivateKey();
const publicKey = ec.starkCurve.getStarkKey(privateKey);
const address = ...; // deployed account address

const account = new Account(provider, address, privateKey);

// Transfer tokens
await account.execute({
  contractAddress: tokenAddress,
  entrypoint: 'transfer',
  calldata: [recipient, amount]
});
```

### DeFi Swap

```typescript
import { AVNU } from "@avnu/avnu-sdk";

// Token swap via AVNU
const quote = await avnu.getQuote({
  fromToken: "0x...", // ETH
  toToken: "0x...", // USDC
  amount: "1000000000000000000",
  sender: account.address,
});

await account.execute(quote.transaction);
```

## Best Practices

1. **Selalu estimasi fee** sebelum melakukan transaksi
2. **Gunakan testnet** (Sepolia) untuk development dan testing
3. **Jaga private key** dengan aman, gunakan environment variables
4. **Verifikasi kontrak** setelah deployment menggunakan Starkscan
5. **Gunakan account abstraction** untuk pengalaman user yang lebih baik
6. **Implementasikan security patterns** untuk melindungi aset

## Referensi

- [Starknet Documentation](https://docs.starknet.io/)
- [Cairo Book](https://book.cairo-lang.org/)
- [starknet.js Documentation](https://starknet.io/docs/)
- [AVNU SDK](https://docs.avnu.fi/)
- [ERC-8004 Standard](https://eips.ethereum.org/EIPS/eip-8004)
- [OpenZeppelin Cairo](https://github.com/OpenZeppelin/cairo-contracts)
