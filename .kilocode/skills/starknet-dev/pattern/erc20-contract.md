# Template ERC20 Token dengan OpenZeppelin

Template ini menyediakan implementasi ERC20 token menggunakan OpenZeppelin Cairo contracts dengan fitur Ownable untuk kontrol minting.

## Dependencies (Scarb)

Tambahkan dependencies di `Scarb.toml`:

```toml
[dependencies]
openzeppelin = { git = "https://github.com/OpenZeppelin/cairo-contracts.git", tag = "v1.1.0" }
```

## Kode Kontrak ERC20

```cairo
#[starknet::contract]
mod MyToken {
    // ========== IMPORTS ==========
    use openzeppelin::token::erc20::ERC20Component;
    use openzeppelin::access::ownable::OwnableComponent;
    use starknet::ContractAddress;

    // ========== COMPONENTS ==========
    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
    #[abi(embed_v0)]
    impl ERC20MetadataImpl = ERC20Component::ERC20MetadataImpl<ContractState>;
    #[abi(embed_v0)]
    impl ERC20CamelOnlyImpl = ERC20Component::ERC20CamelOnlyImpl<ContractState>;

    // Ownable Mixin
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;

    // Internal Impl
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // ========== STORAGE ==========
    #[storage]
    struct Storage {
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    // ========== EVENTS ==========
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
    }

    // ========== CONSTRUCTOR ==========
    #[constructor]
    fn constructor(
        ref self: ContractState,
        name: felt252,
        symbol: felt252,
        decimals: u8,
        initial_supply: u256,
        recipient: ContractAddress,
        owner: ContractAddress
    ) {
        // Initialize ERC20
        self.erc20.initializer(name, symbol, decimals);

        // Mint initial supply ke recipient
        self.erc20.mint(recipient, initial_supply);

        // Initialize Ownable dengan owner
        self.ownable.initializer(owner);
    }

    // ========== MINTING (HANYA OWNER) ==========
    #[external(v0)]
    fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
        // Ownable check - hanya owner yang bisa mint
        self.ownable.assert_only_owner();
        self.erc20.mint(to, amount);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, account: ContractAddress, amount: u256) {
        self.erc20.burn(account, amount);
    }
}
```

## Fitur Utama

### 1. ERC20 Component

- `transfer`: Transfer token ke alamat lain
- `transfer_from`: Transfer dengan allowance
- `approve` / `increase_allowance`: Atur allowance
- `balance_of`: Cek saldo
- `total_supply`: Total supply token

### 2. Ownable Component

- `owner`: Mendapatkan alamat owner
- `transfer_ownership`: Transfer ownership ke alamat baru
- `renounce_ownership`: Hapus ownership

### 3. Supply Management

- **Minting**: Hanya owner dapat membuat token baru
- **Burning**: Siapa saja dapat membakar token miliknya

## Penggunaan dengan Starknet.js

```typescript
import { Contract, RpcProvider, Account } from "starknet";

// Connect ke network
const provider = new RpcProvider({
  nodeUrl: "https://api.cartridge.gg/x/starknet/main",
});
const account = new Account(provider, address, privateKey);

// Connect ke ERC20 contract
const erc20 = new Contract(erc20Abi, tokenAddress, provider);

// Transfer token
await erc20.transfer(recipientAddress, amount_256);
```

## Konfigurasi Decimals

- **18 decimals** (standar Ethereum): 1 token = 10^18 units
- **6 decimals** (stablecoin): 1 token = 10^6 units
- **0 decimals** (NFT-like): 1 token = 1 unit

## Best Practices

1. **Simpan private key owner** dengan aman
2. **Gunakan multisig** untuk owner account produksi
3. **Verifikasi total supply** sesuai kebutuhan aplikasi
4. **Consider pausable** untuk emergency stop
5. **Gunakan upgradeable pattern** jika perlu update logic
