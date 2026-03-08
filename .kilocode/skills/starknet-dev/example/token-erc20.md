# Contoh Project ERC20 Token di Starknet

Panduan lengkap untuk membuat ERC20 token di Starknet menggunakan Cairo dan OpenZeppelin.

## Prerequisites

Pastikan sudah install:

- [Scarb](https://docs.swmansion.com/scarb/download.html) - Cairo package manager
- [Starknet Foundry](https://foundry.rhino.app/) - sncast & snforge

## Struktur Project

```
my_erc20_token/
├── Scarb.toml
└── src/
    └── my_token.cairo
```

## Step 1: Konfigurasi Scarb

Buat file `Scarb.toml`:

```toml
[package]
name = "my_erc20_token"
version = "0.1.0"
edition = "2024_07"

[dependencies]
starknet = "2.0.0"
openzeppelin = "0.20.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

## Step 2: Contract ERC20

Buat file `src/my_token.cairo`:

```cairo
use starknet::ContractAddress;
use openzeppelin::token::erc20::ERC20Component;
use openzeppelin::access::ownable::OwnableComponent;

component!(path: ERC20Component, storage: erc20, event: ERC20Event);
component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

// ERC20 Mixin
#[abi(embed_v0)]
impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
#[abi(embed_v0)]
impl ERC20MetadataImpl = ERC20Component::ERC20MetadataImpl<ContractState>;
#[abi(embed_v0)]
impl ERC20CamelOnlyImpl = ERC20Component::ERC20CamelOnlyImpl<ContractState>;
impl InternalImpl = ERC20Component::InternalImpl<ContractState>;

// Ownable Mixin
#[abi(embed_v0)]
impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
#[abi(embed_v0)]
impl OwnableCamelOnlyImpl = OwnableComponent::OwnableCamelOnlyImpl<ContractState>;
impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

#[storage]
struct Storage {
    #[substorage(v0)]
    erc20: ERC20Component::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
}

#[event]
enum Event {
    #[flat]
    ERC20Event: ERC20Component::Event,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
}

#[constructor]
fn constructor(
    ref self: ContractState,
    name: felt252,
    symbol: felt252,
    initial_supply: u256,
    recipient: ContractAddress,
    owner: ContractAddress
) {
    self.erc20.initializer(name, symbol);
    self.ownable.initializer(owner);
    self.erc20.mint(recipient, initial_supply);
}
```

## Step 3: Testing dengan snforge

Buat file `tests/test_my_token.cairo`:

```cairo
use starknet::ContractAddress;
use starknet::testing::set_caller_address;
use my_erc20_token::my_token::MyToken;

fn setup() -> (ContractAddress, ContractAddress) {
    let owner: ContractAddress = starknet::contract_address_const::<0x123>();
    let user: ContractAddress = starknet::contract_address_const::<0x456>();
    (owner, user)
}

#[test]
fn test_token_metadata() {
    let (owner, _) = setup();

    let name = MyToken::name();
    assert(name == 'MyToken', 'wrong name');

    let symbol = MyToken::symbol();
    assert(symbol == 'MTK', 'wrong symbol');
}

#[test]
fn test_mint() {
    let (owner, user) = setup();
    set_caller_address(owner);

    let initial_supply: u256 = u256 { low: 1000000, high: 0 };
    let balance = MyToken::balance_of(user);
    assert(balance.low == 1000000, 'wrong balance');
}

#[test]
fn test_transfer() {
    let (owner, user) = setup();
    set_caller_address(user);

    MyToken::transfer(owner, u256 { low: 100, high: 0 });

    let balance = MyToken::balance_of(user);
    assert(balance.low == 999900, 'wrong balance');
}
```

Jalankan test:

```bash
snforge test
```

## Step 4: Deployment

### 4.1 Buat Account (jika belum ada)

```bash
# Generate random keypair
sncast wallet create --name my_account --account my_account
```

### 4.2 Declare Contract

```bash
sncast declare \
  --contract-name MyToken \
  --max-fee 0.0001 \
  --account my_account
```

### 4.3 Deploy Contract

```bash
# Parse class hash dari output declare
sncast deploy \
  --class-hash 0x123... \
  --constructor-calldata "MyToken" "MTK" 1000000 0x456 0x123 \
  --max-fee 0.0001 \
  --account my_account
```

## Integrasi dengan Frontend

### Install starknet.js

```bash
npm install starknet@^9.2.1
```

### Interaksi dengan Contract

```typescript
import { Account, Contract, json } from "starknet";

const TOKEN_ABI = json.parse([
  "function name() -> (felt252)",
  "function symbol() -> (felt252)",
  "function decimals() -> (u8)",
  "function total_supply() -> (u256)",
  "function balance_of(owner: ContractAddress) -> (u256)",
  "function transfer(to: ContractAddress, amount: u256)",
  "event Transfer(from: ContractAddress, to: ContractAddress, value: u256)",
]);

const tokenAddress = "0x...";

const token = new Contract(TOKEN_ABI, tokenAddress, account);

// Get balance
const balance = await token.balance_of(account.address);
console.log("Balance:", balance);

// Transfer tokens
await token.transfer(recipientAddress, { low: 1000, high: 0 });
```

## Tips Keamanan

1. **Supply initialization**: Pastikan initial_supply tidak overflow
2. **Access control**: Hanya owner yang bisa mint/burn
3. **Reentrancy**: Cairo tidak vulnerable terhadap reentrancy attack
4. **Testing**: Selalu test edge cases dengan snforge

## Referensi

- [OpenZeppelin Cairo Contracts](https://github.com/OpenZeppelin/cairo-contracts)
- [ERC20 Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Cairo Book](https://book.cairo-lang.org/)
- [Starknet Foundry](https://foundry.rhino.app/)
