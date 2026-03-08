# NFT Marketplace Example - Contoh Proyek NFT Marketplace Lengkap untuk Hackathon

## Overview

Contoh ini menunjukkan proyek NFT Marketplace lengkap yang dibangun untuk hackathon. Proyek ini mencakup smart contracts untuk NFT (ERC-721) dan marketplace, frontend untuk minting dan trading, serta IPFS integration untuk metadata storage.

## 1. Project Concept

### 1.1 Problem Statement

"NFT marketplaces have high barriers to entry - upfront gas fees, complex wallet requirements, and confusing interfaces prevent average users from participating. Additionally, creators face high costs to mint NFTs before selling them."

### 1.2 Solution: MintCraft

**MintCraft** adalah NFT marketplace yang membuat NFT accessible untuk semua orang:

- Lazy minting - creators tidak bayar gas sampai terjadi продажа
- Gasless minting untuk buyers dengan meta-transactions
- Social login support untuk easy onboarding
- Low fees di Polygon network

### 1.3 Tech Stack

| Component       | Technology                                 |
| --------------- | ------------------------------------------ |
| Blockchain      | Polygon (low fees, fast)                   |
| Smart Contracts | Solidity + Hardhat (ERC-721 + Marketplace) |
| NFT Standard    | ERC-721A (gas-optimized)                   |
| Frontend        | Next.js 14 + Wagmi + RainbowKit            |
| Storage         | IPFS via Pinata                            |
| Database        | PostgreSQL + Prisma (for off-chain data)   |
| Wallet          | RainbowKit                                 |

## 2. Smart Contracts

### 2.1 NFT Collection Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC721A } from "erc721a/contracts/ERC721A.sol";
import { ERC721ABurnable } from "erc721a/contracts/extensions/ERC721ABurnable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MintCraftNFT
 * @dev Gas-optimized ERC-721 NFT contract with lazy minting support
 */
contract MintCraftNFT is ERC721A, ERC721ABurnable, Ownable {
    string public baseURI;
    string public contractURI;
    uint256 public maxSupply = 10000;
    uint256 public mintPrice = 0.01 ether;
    bool public publicMintEnabled = false;

    // Lazy minting: signed messages for gasless minting
    mapping(bytes32 => bool) public usedMessages;

    // Royalty info (EIP-2981)
    uint256 public royaltyBps = 500; // 5%
    address public royaltyRecipient;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        address _royaltyRecipient
    ) ERC721A(_name, _symbol) Ownable(msg.sender) {
        baseURI = _baseURI;
        royaltyRecipient = _royaltyRecipient;
        contractURI = string(abi.encodePacked(baseURI, "contract.json"));
    }

    // ===== Minting Functions =====

    function mint(uint256 quantity) external payable {
        require(publicMintEnabled, "Public mint not enabled");
        require(totalSupply() + quantity <= maxSupply, "Max supply exceeded");
        require(msg.value >= mintPrice * quantity, "Insufficient payment");

        _mint(msg.sender, quantity);

        // Refund excess
        if (msg.value > mintPrice * quantity) {
            payable(msg.sender).refund(msg.value - mintPrice * quantity);
        }
    }

    // Lazy minting for creators (no gas upfront)
    function lazyMint(
        address to,
        uint256 quantity,
        bytes calldata signature
    ) external {
        // Verify signature (simplified - use proper signing in production)
        bytes32 messageHash = keccak256(abi.encodePacked(to, quantity, block.chainid));
        require(!usedMessages[messageHash], "Message already used");

        usedMessages[messageHash] = true;
        _mint(to, quantity);
    }

    // ===== Admin Functions =====

    function setBaseURI(string memory _baseURI) external onlyOwner {
        baseURI = _baseURI;
    }

    function setPublicMintEnabled(bool _enabled) external onlyOwner {
        publicMintEnabled = _enabled;
    }

    function setMintPrice(uint256 _price) external onlyOwner {
        mintPrice = _price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ===== EIP-2981 Royalty =====

    function setRoyaltyInfo(address _recipient, uint256 _bps) external onlyOwner {
        royaltyRecipient = _recipient;
        royaltyBps = _bps;
    }

    function royaltyInfo(uint256, uint256 salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        return (royaltyRecipient, (salePrice * royaltyBps) / 10000);
    }

    // ===== Overrides =====

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721A)
        returns (bool)
    {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f || // ERC721Metadata
            interfaceId == 0x2a55205a;   // EIP-2981
    }
}
```

### 2.2 Marketplace Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/**
 * @title IMarketplace
 * @dev Interface for marketplace functions
 */
interface IMarketplace {
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        address paymentToken
    ) external;

    function buyItem(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 price
    ) external payable;

    function cancelListing(
        address nftContract,
        uint256 tokenId
    ) external;
}

/**
 * @title MintCraftMarketplace
 * @dev NFT Marketplace with lazy listing and offers
 */
contract MintCraftMarketplace is IMarketplace {
    struct Listing {
        address seller;
        uint256 price;
        address paymentToken;
        bool active;
    }

    // Protocol fee (2.5%)
    uint256 public constant FEE_BPS = 250;
    address public feeRecipient;

    // Listings: nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // Events
    event ItemListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event ItemSold(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 price
    );
    event ListingCancelled(
        address indexed nftContract,
        uint256 indexed tokenId
    );

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    // ===== Marketplace Functions =====

    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price,
        address paymentToken
    ) external override {
        require(price > 0, "Price must be > 0");

        listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price,
            paymentToken: paymentToken,
            active: true
        });

        emit ItemListed(nftContract, tokenId, msg.sender, price);
    }

    function buyItem(
        address nftContract,
        uint256 tokenId,
        address paymentToken,
        uint256 price
    ) external payable override {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.active, "Item not listed");
        require(listing.price == price, "Price mismatch");

        // Calculate fees
        uint256 fee = (price * FEE_BPS) / 10000;
        uint256 sellerAmount = price - fee;

        // Transfer NFT to buyer
        IERC721(nftContract).transferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        // Transfer payment (handle ETH/native token)
        if (paymentToken == address(0)) {
            // Native ETH
            payable(listing.seller).transfer(sellerAmount);
            payable(feeRecipient).transfer(fee);
        } else {
            // ERC20 token
            IERC20(paymentToken).transferFrom(
                msg.sender,
                listing.seller,
                sellerAmount
            );
            IERC20(paymentToken).transferFrom(
                msg.sender,
                feeRecipient,
                fee
            );
        }

        // Remove listing
        delete listings[nftContract][tokenId];

        emit ItemSold(nftContract, tokenId, listing.seller, msg.sender, price);
    }

    function cancelListing(
        address nftContract,
        uint256 tokenId
    ) external override {
        Listing memory listing = listings[nftContract][tokenId];
        require(listing.seller == msg.sender, "Not the seller");

        delete listings[nftContract][tokenId];

        emit ListingCancelled(nftContract, tokenId);
    }

    // Helper to get listing
    function getListing(address nftContract, uint256 tokenId)
        external
        view
        returns (
            address seller,
            uint256 price,
            address paymentToken,
            bool active
        )
    {
        Listing memory listing = listings[nftContract][tokenId];
        return (listing.seller, listing.price, listing.paymentToken, listing.active);
    }
}

// Minimal ERC721 interface for transfers
interface IERC721 {
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;
}

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}
```

### 2.3 Deployment Script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying MintCraft NFT Marketplace...");

  // Deploy NFT Collection
  const NFT = await ethers.getContractFactory("MintCraftNFT");
  const nft = await NFT.deploy(
    "MintCraft Collection", // name
    "MCC", // symbol
    "ipfs://QmYourBaseURI/", // baseURI
    (await ethers.getSigners())[0].address, // royalty recipient
  );
  await nft.waitForDeployment();
  const nftAddress = await nft.getAddress();
  console.log(`NFT Collection deployed to: ${nftAddress}`);

  // Deploy Marketplace
  const Marketplace = await ethers.getContractFactory("MintCraftMarketplace");
  const marketplace = await Marketplace.deploy(
    (await ethers.getSigners())[0].address, // fee recipient
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log(`Marketplace deployed to: ${marketplaceAddress}`);

  // Enable public mint
  await nft.setPublicMintEnabled(true);
  console.log("Public mint enabled");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(`NFT Collection: ${nftAddress}`);
  console.log(`Marketplace: ${marketplaceAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 3. Frontend Implementation

### 3.1 Marketplace Page

```tsx
// src/app/page.tsx
"use client";

import { useAccount, useConnect } from "wagmi";
import { ConnectButton } from "@/components/web3/connect-button";
import { NFTGrid } from "@/components/nft/nft-grid";
import { CreateCollection } from "@/components/nft/create-collection";
import { SearchBar } from "@/components/nft/search-bar";

export default function Marketplace() {
  const { isConnected } = useAccount();
  const { connectors } = useConnect();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">MintCraft</h1>
          <ConnectButton />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            NFT Marketplace for Everyone
          </h2>
          <p className="text-xl mb-8">
            Create, buy, and sell NFTs with zero gas fees for minting
          </p>
          {!isConnected && (
            <div className="flex justify-center gap-4">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => useConnect({ connector })}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Connect Wallet
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Create Button */}
        {isConnected && (
          <div className="mb-8">
            <CreateCollection />
          </div>
        )}

        {/* NFT Grid */}
        <NFTGrid />
      </main>
    </div>
  );
}
```

### 3.2 NFT Card Component

```tsx
// src/components/nft/nft-card.tsx
"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { marketplaceABI } from "@/lib/contracts/abis";
import { MARKETPLACE_ADDRESS } from "@/lib/contracts/addresses";
import { parseEther } from "viem";

interface NFTCardProps {
  tokenId: bigint;
  name: string;
  image: string;
  price: string;
  seller: string;
}

export function NFTCard({ tokenId, name, image, price, seller }: NFTCardProps) {
  const [buying, setBuying] = useState(false);

  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleBuy = () => {
    writeContract({
      address: MARKETPLACE_ADDRESS,
      abi: marketplaceABI,
      functionName: "buyItem",
      args: [
        "0x...", // NFT contract address
        tokenId,
        address(0), // Native ETH
        parseEther(price),
      ],
      value: parseEther(price),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-gray-500 text-sm mb-3">#{tokenId.toString()}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-bold text-indigo-600">{price} ETH</p>
          </div>

          <button
            onClick={handleBuy}
            disabled={isConfirming}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isConfirming ? "Buying..." : "Buy"}
          </button>
        </div>

        {isSuccess && (
          <p className="mt-2 text-sm text-green-600">Purchase successful! 🎉</p>
        )}
      </div>
    </div>
  );
}
```

### 3.3 IPFS Upload Utility

```typescript
// src/lib/ipfs.ts
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "gateway.pinata.cloud",
});

export async function uploadMetadata(metadata: {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}) {
  const result = await pinata.upload.json(metadata);
  return `ipfs://${result.IpfsHash}`;
}

export async function uploadImage(file: File) {
  const result = await pinata.upload.file(file);
  return `ipfs://${result.IpfsHash}`;
}

export function getIPFSUrl(cid: string): string {
  if (cid.startsWith("ipfs://")) {
    return `https://gateway.pinata.cloud/ipfs/${cid.slice(7)}`;
  }
  return cid;
}
```

## 4. Demo Script

### 4.1 Demo Flow (5 minutes)

```
[0:00-0:30] OPENING
"NFTs are for everyone. But current marketplaces make it hard -
high gas fees, complex interfaces, creators pay to mint upfront.
Today I'm showing MintCraft - NFT marketplace for everyone."

[0:30-1:00] CONNECT & BROWSE
- Show marketplace homepage
- Connect wallet (show it's easy)
- Browse existing NFTs
- Show collection view

[1:00-2:30] MINT NEW NFT
- Click "Create"
- Upload image (drag and drop)
- Fill metadata: name, description, traits
- Click "Mint"
- MetaMask - NO GAS FEE! (lazy minting)
- Show success
- View minted NFT in profile

[2:30-3:30] LIST FOR SALE
- Click "List for Sale"
- Set price (e.g., 0.1 ETH)
- Confirm listing
- Show listed item

[3:30-4:30] BUY NFT
- Switch to buyer account (show we prepared)
- Browse marketplace
- Click "Buy" on an NFT
- MetaMask confirmation
- Show ownership transfer
- Congratulations! You own an NFT!

[4:30-5:00] CLOSING
"MintCraft - create, buy, sell NFTs without the gas headache.
Built on Polygon. Try it at mintcraft.demo"
```

### 4.2 Pitch Points

1. **Problem**: High barriers to NFT creation and trading
2. **Solution**: Lazy minting + gasless transactions
3. **Innovation**: Meta-transactions untuk UX
4. **Tech**: Polygon untuk low fees
5. **Market**: NFT market growing, accessibility key

## 5. NFT Metadata Standard

### 5.1 Metadata JSON Format

```json
{
  "name": "MintCraft #1",
  "description": "A unique digital collectible from MintCraft Marketplace",
  "image": "ipfs://QmYourImageHash/image.png",
  "external_url": "https://mintcraft.xyz/collection/1",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Purple"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "display_type": "number",
      "trait_type": "Generation",
      "value": 1
    }
  ]
}
```

### 5.2 Contract Metadata

```json
{
  "name": "MintCraft Collection",
  "description": "A collection of unique digital collectibles",
  "image": "ipfs://QmCollectionImage/collection.png",
  "external_link": "https://mintcraft.xyz",
  "seller_fee_basis_points": 250,
  "fee_recipient": "0x..."
}
```

---

## Summary

Proyek NFT Marketplace ini menunjukkan bagaimana membangun:

1. **Smart Contracts** - ERC-721A NFT collection dengan lazy minting dan marketplace
2. **Frontend** - Modern marketplace dengan NFT display dan trading
3. **Storage** - IPFS integration untuk metadata
4. **Demo** - Complete walkthrough dalam 5 menit

Tips untuk hackathon NFT:

- Fokus pada lazy minting sebagai key differentiator
- Gunakan Polygon/Mumbai testnet untuk deployment
- Highlight ease of use untuk new users
- Prepare multiple accounts untuk demo buying/selling

Proyek ini bisa di-extend dengan:

- Auction functionality
- Collection creation (factory contract)
- Offers dan bidding
- Royalty splits untuk collaborators
- NFT fractionalization
