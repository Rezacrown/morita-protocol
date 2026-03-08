# Cairo Deploy

Referensi untuk men-deploy smart contract Cairo ke Starknet menggunakan sncast (Starknet Foundry).

## Kapan Menggunakan

- Men-deploy kontrak ke Starknet devnet, Sepolia, atau mainnet
- Mendeklarasikan contract classes
- Menyiapkan akun deployer
- Mengkonfigurasi network endpoints
- Memverifikasi kontrak yang di-deploy
- Memanggil/men-invoke kontrak yang di-deploy

**Bukan untuk:** Menulis kontrak (gunakan cairo-contracts), testing (gunakan cairo-testing), optimisasi (gunakan cairo-optimization)

## Setup

### Install Starknet Foundry

```bash
# Install via asdf (recommended for version pinning)
asdf plugin add starknet-foundry
asdf install starknet-foundry 0.56.0
asdf global starknet-foundry 0.56.0

# Or install directly
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh
snfoundryup
```

## Build

```bash
# Build contracts (generates Sierra + CASM)
scarb build
```

Output goes to `target/dev/`:

- `myproject_MyContract.contract_class.json` (Sierra)
- `myproject_MyContract.compiled_contract_class.json` (CASM)

## Setup Akun

### Membuat Akun Baru

```bash
# Generate account on Sepolia
sncast account create \
    --url https://starknet-sepolia.g.alchemy.com/v2/YOUR_KEY \
    --name my-deployer

# Deploy the account contract
sncast account deploy \
    --url https://starknet-sepolia.g.alchemy.com/v2/YOUR_KEY \
    --name my-deployer
```

### Import Akun Eksisting

```bash
sncast account add \
    --url https://starknet-sepolia.g.alchemy.com/v2/YOUR_KEY \
    --name my-deployer \
    --address 0x123... \
    --private-key 0xabc... \
    --type oz
```

Account types: `oz` (OpenZeppelin), `argent`, `braavos`

## sncast.toml

```toml
[default]
url = "https://starknet-sepolia.g.alchemy.com/v2/YOUR_KEY"
account = "my-deployer"
accounts-file = "~/.starknet_accounts/starknet_open_zeppelin_accounts.json"
wait = true

[mainnet]
url = "https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY"
account = "mainnet-deployer"
```

## Declare (Register Class)

```bash
# Declare contract
sncast declare \
    --contract-name MyContract

# Output:
# class_hash: 0x1234...
# transaction_hash: 0xabcd...
```

## Deploy (Create Instance)

```bash
# Deploy with constructor args
sncast deploy \
    --class-hash 0x1234... \
    --constructor-calldata 0xOWNER_ADDRESS

# Multiple constructor args
sncast deploy \
    --class-hash 0x1234... \
    --constructor-calldata 0xOWNER 0xTOKEN_ADDRESS 1000
```

### Constructor Calldata Encoding

- `ContractAddress` — pass as hex `0x123...`
- `u256` — pass as TWO felts: `low high` (e.g., `1000 0` for 1000)
- `felt252` — pass directly
- `bool` — `1` for true, `0` for false

## Invoke (Write)

```bash
sncast invoke \
    --contract-address 0xCONTRACT \
    --function "transfer" \
    --calldata 0xRECIPIENT 1000 0
```

## Call (Read)

```bash
sncast call \
    --contract-address 0xCONTRACT \
    --function "get_balance" \
    --calldata 0xACCOUNT
```

## Network Endpoints

| Network           | RPC URL                                         |
| ----------------- | ----------------------------------------------- |
| Devnet (local)    | `http://localhost:5050`                         |
| Sepolia (testnet) | `https://starknet-sepolia.g.alchemy.com/v2/KEY` |
| Mainnet           | `https://starknet-mainnet.g.alchemy.com/v2/KEY` |

## Referensi

- [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/)
- [Starknet Documentation](https://docs.starknet.io/)
