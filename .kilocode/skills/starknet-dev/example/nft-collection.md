# Contoh Project NFT Collection di Starknet

Panduan lengkap untuk membuat NFT collection menggunakan ERC721 dengan OpenZeppelin di Starknet.

## Prerequisites

- [Scarb](https://docs.swmansion.com/scarb/download.html)
- [Starknet Foundry](https://foundry.rhino.app/)

## Struktur Project

```
nft_collection/
├── Scarb.toml
└── src/
    ├── my_nft.cairo
    └── interface.cairo
```

## Step 1: Konfigurasi Scarb

```toml
[package]
name = "nft_collection"
version = "0.1.0"
edition = "2024_07"

[dependencies]
starknet = "2.0.0"
openzeppelin = "0.20.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

## Step 2: ERC721 Contract

Buat file `src/my_nft.cairo`:

```cairo
use starknet::ContractAddress;
use starknet::get_caller_address;
use openzeppelin::token::erc721::ERC721Component;
use openzeppelin::token::erc721::ERC721MetadataComponent;
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::introspection::src5::SRC5Component;

component!(path: ERC721Component, storage: erc721, event: ERC721Event);
component!(path: ERC721MetadataComponent, storage: erc721_metadata, event: ERC721MetadataEvent);
component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
component!(path: SRC5Component, storage: src5, event: SRC5Event);

// ERC721 Storage
#[storage]
struct Storage {
    #[substorage(v0)]
    erc721: ERC721Component::Storage,
    #[substorage(v0)]
    erc721_metadata: ERC721MetadataComponent::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    #[substorage(v0)]
    src5: SRC5Component::Storage,
    max_supply: u256,
    minted_count: u256,
    base_uri: ByteArray,
}

// ERC721 Events
#[event]
enum Event {
    #[flat]
    ERC721Event: ERC721Component::Event,
    #[flat]
    ERC721MetadataEvent: ERC721MetadataComponent::Event,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
    #[flat]
    SRC5Event: SRC5Component::Event,
    Mint: MintEvent,
}

#[derive(Drop, Serde, starknet::Encode)]
struct MintEvent {
    to: ContractAddress,
    token_id: u256,
}

// ERC721 Implementation
#[abi(embed_v0)]
impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
#[abi(embed_v0)]
impl ERC721MetadataImpl = ERC721MetadataComponent::ERC721MetadataImpl<ContractState>;
#[abi(embed_v0)]
impl ERC721CamelOnlyImpl = ERC721Component::ERC721CamelOnlyImpl<ContractState>;
impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;
impl SRC5InternalImpl = SRC5Component::InternalImpl<ContractState>;

// Ownable Implementation
#[abi(embed_v0)]
impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

#[constructor]
fn constructor(
    ref self: ContractState,
    name: felt252,
    symbol: felt252,
    base_uri: ByteArray,
    max_supply: u256,
    owner: ContractAddress
) {
    self.erc721.initializer(name, symbol);
    self.erc721_metadata.initializer(base_uri);
    self.ownable.initializer(owner);
    self.src5.register_interface(ERC721Interface::INTERFACE_ID);
    self.max_supply = max_supply;
    self.minted_count = u256 { low: 0, high: 0 };
    self.base_uri = base_uri;
}

// Public Functions
#[external(v0)]
impl NFTImpl of INFT {
    fn mint(ref self: ContractState, to: ContractAddress) -> u256 {
        // Access control: only owner can mint
        let owner = self.ownable.owner();
        let caller = get_caller_address();
        assert(caller == owner, 'Caller is not owner');

        // Check max supply
        let current = self.minted_count.read();
        assert(current < self.max_supply.read(), 'Max supply reached');

        // Mint new token
        let token_id = current + u256 { low: 1, high: 0 };
        self.erc721.mint(to, token_id);
        self.minted_count.write(token_id);

        self.emit(MintEvent { to, token_id });
        token_id
    }

    fn mint_batch(ref self: ContractState, to: ContractAddress, amount: u256) {
        let owner = self.ownable.owner();
        let caller = get_caller_address();
        assert(caller == owner, 'Caller is not owner');

        let mut i: u256 = u256 { low: 0, high: 0 };
        loop {
            if i >= amount {
                break;
            }
            let _ = self.NFTImpl::mint(to);
            i += u256 { low: 1, high: 0 };
        };
    }

    fn set_base_uri(ref self: ContractState, new_uri: ByteArray) {
        self.ownable.assert_only_owner();
        self.erc721_metadata.set_base_uri(new_uri);
    }

    fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
        let base = self.erc721_metadata.base_uri();
        let token_uri = format!("{}/{}.json", base, token_id.into());
        token_uri
    }

    fn total_supply(self: @ContractState) -> u256 {
        self.max_supply.read()
    }

    fn minted_count(self: @ContractState) -> u256 {
        self.minted_count.read()
    }
}

// Interface Definition
trait INFT {
    fn mint(to: ContractAddress) -> u256;
    fn mint_batch(to: ContractAddress, amount: u256);
    fn set_base_uri(new_uri: ByteArray);
    fn token_uri(token_id: u256) -> ByteArray;
    fn total_supply() -> u256;
    fn minted_count() -> u256;
}

// ByteArray support for Cairo 2.x
trait ByteArrayTrait {
    fn format(self: @ByteArray, token_id: u256) -> ByteArray;
}
```

## Step 3: Metadata Handling

Buat file JSON untuk metadata NFT:

```json
{
  "name": "My NFT #1",
  "description": "A unique NFT from MyCollection",
  "image": "ipfs://QmYourImageHash",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Level",
      "value": 5
    }
  ],
  "external_url": "https://mycollection.com/nft/1"
}
```

### Metadata Standards

```cairo
// SRC4907 - NFT Metadata JSON Standard
// Format URI: https://api.example.com/token/{id}

// Contoh URI generation:
// Input: token_id = 1
// Output: https://api.example.com/token/1.json
```

## Step 4: Testing

```cairo
use starknet::ContractAddress;
use nft_collection::my_nft::MyNFT;

#[test]
fn test_mint() {
    let owner: ContractAddress = starknet::contract_address_const::<0x123>();
    let recipient: ContractAddress = starknet::contract_address_const::<0x456>();
    set_caller_address(owner);

    let token_id = MyNFT::mint(recipient);
    assert(token_id.low == 1, 'wrong token id');

    let owner_of = MyNFT::owner_of(token_id);
    assert(owner_of == recipient, 'wrong owner');
}

#[test]
fn test_token_uri() {
    let uri = MyNFT::token_uri(u256 { low: 1, high: 0 });
    // Verify URI format
}

#[test]
fn test_max_supply() {
    let max = MyNFT::total_supply();
    assert(max.low == 10000, 'wrong max supply');
}
```

## Step 5: Deployment

```bash
# Declare contract
sncast declare --contract-name MyNFT --max-fee 0.0001 --account my_account

# Deploy with constructor args
sncast deploy \
  --class-hash 0x123... \
  --constructor-calldata "MyNFT" "MNFT" "ipfs://QmBaseURI" 10000 0x123 \
  --max-fee 0.0001 \
  --account my_account
```

## Step 6: Frontend Integration

### Install starknet.js

```bash
npm install starknet@^9.2.1
```

### Interaksi dengan NFT Contract

```typescript
import { Account, Contract, json, uint256 } from "starknet";

const NFT_ABI = json.parse([
  "function name() -> (felt252)",
  "function symbol() -> (felt252)",
  "function owner_of(token_id: u256) -> (ContractAddress)",
  "function token_uri(token_id: u256) -> (ByteArray)",
  "function mint(to: ContractAddress) -> (u256)",
  "function balance_of(account: ContractAddress) -> (u256)",
  "function minted_count() -> (u256)",
  "function total_supply() -> (u256)",
  "event Transfer(from: ContractAddress, to: ContractAddress, token_id: u256)",
  "event Mint(to: ContractAddress, token_id: u256)",
]);

const nftAddress = "0x...";
const nft = new Contract(NFT_ABI, nftAddress, account);

// Get token URI
const tokenId = uint256.bnToUint256(1);
const uri = await nft.token_uri(tokenId);
console.log("Token URI:", uri);

// Get owner of token
const owner = await nft.owner_of(tokenId);
console.log("Owner:", owner.address);

// Get user's balance
const balance = await nft.balance_of(account.address);
console.log("Balance:", balance);

// Mint NFT (owner only)
await nft.mint(recipientAddress);

// Get minted count
const minted = await nft.minted_count();
console.log("Minted:", minted);
```

## Step 7: Batch Minting

```typescript
// Batch mint untuk airdrop
async function batchMint(recipients: string[]) {
  const calls = recipients.map((recipient) => ({
    contractAddress: nftAddress,
    entrypoint: "mint",
    calldata: [recipient],
  }));

  // Execute batch
  const tx = await account.execute(calls);
  await provider.waitForTransaction(tx.transaction_hash);
}
```

## Tips Keamanan

1. **Access control**: Pastikan hanya owner yang bisa mint
2. **Reentrancy protection**: Cairo inherently safe
3. **Supply limit**: Selalu check max supply sebelum minting
4. **Token ID uniqueness**: Setiap token ID harus unique

## Referensi

- [ERC721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin Cairo ERC721](https://github.com/OpenZeppelin/cairo-contracts)
- [Metadata Standard](https://docs.opensea.io/docs/metadata-standards)
- [starknet.js Documentation](https://www.starknet-react.com/)
