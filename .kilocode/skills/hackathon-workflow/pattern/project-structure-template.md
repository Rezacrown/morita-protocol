# Project Structure Template - Template Struktur Proyek Hackathon Web3

## Overview

Struktur proyek yang baik akan mempercepat development dan membuat codebase lebih maintainable. Template ini menyediakan struktur lengkap untuk proyek hackathon Web3 dengan monorepo setup yang mengoptimalkan workflow development.

## 1. Monorepo Structure

### 1.1 Recommended Project Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     HACKATHON PROJECT STRUCTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ my-hackathon-project/                                          │
│ ├── .github/                                                   │
│ │   └── workflows/                                            │
│ │       └── deploy.yml                                        │
│ │                                                              │
│ ├── packages/                                                  │
│ │   ├── contracts/  (Smart Contracts - Hardhat/Foundry)        │
│ │   ├── frontend/  (Next.js dApp)                            │
│ │   └── backend/   (Hono.js API - optional)                  │
│ │                                                              │
│ ├── .gitignore                                                │
│ ├── package.json                                               │
│ ├── tsconfig.json                                              │
│ └── README.md                                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Root Configuration Files

**package.json (Root):**

```json
{
  "name": "my-hackathon-project",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^1.12.0",
    "typescript": "^5.3.0"
  }
}
```

## 2. Smart Contract Directory Layout

### 2.1 Contracts Package Structure

```
packages/contracts/
├── .env.example
├── .gitignore
├── foundry.toml (or hardhat.config.ts)
├── package.json
├── remappings.txt (Foundry)
├── solc.json (Foundry)
├── src/
│   ├── interfaces/
│   │   └── IMyContract.sol
│   ├── mocks/
│   │   └── MockToken.sol
│   ├── MyContract.sol
│   └── MyToken.sol
├── script/
│   ├── Deploy.s.sol
│   └── Interact.s.sol
├── test/
│   ├── MyContract.t.sol
│   └── MyToken.t.sol
└── lib/
    ├── forge-std/
    └── openzeppelin-contracts/
```

### 2.2 Smart Contract Organization

**src/BaseContract.sol:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

abstract contract BaseContract {
    error ZeroAddress();
    error ZeroAmount();

    modifier nonZeroAddress(address _addr) {
        if (_addr == address(0)) revert ZeroAddress();
        _;
    }

    modifier nonZeroAmount(uint256 _amount) {
        if (_amount == 0) revert ZeroAmount();
        _;
    }
}
```

**src/MyProject.sol:**

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { BaseContract } from "./BaseContract.sol";
import { IMyProject } from "./interfaces/IMyProject.sol";

contract MyProject is BaseContract, IMyProject {
    // State variables
    mapping(address => uint256) public balances;

    // Events
    event Deposit(address indexed user, uint256 amount);

    // Functions
    function deposit() external payable nonZeroAmount(msg.value) override {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
```

## 3. Frontend Project Structure

### 3.1 Frontend Package Structure

```
packages/frontend/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── web3/
│   │   │   ├── wallet-button.tsx
│   │   │   ├── contract-card.tsx
│   │   │   └── transaction-button.tsx
│   │   └── layout/
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── sidebar.tsx
│   ├── hooks/
│   │   ├── use-contract.ts
│   │   └── use-events.ts
│   ├── lib/
│   │   ├── contracts/
│   │   │   ├── abis/
│   │   │   │   ├── mycontract.json
│   │   │   │   └── mytoken.json
│   │   │   └── addresses.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts
├── .env.example
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### 3.2 Frontend Key Files

**src/app/providers.tsx:**

```tsx
"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#7c3aed",
            accentColorForeground: "white",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**src/lib/wagmi.ts:**

```ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, polygon, arbitrum } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My Hackathon Project",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia, polygon, arbitrum],
  ssr: false,
});
```

## 4. Backend API Structure (Optional)

### 4.1 Backend Package Structure

```
packages/backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── users.ts
│   │   └── contracts.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── logger.ts
│   ├── services/
│   │   ├── database.ts
│   │   └── ipfs.ts
│   └── utils/
│       └── helpers.ts
├── drizzle/
│   └── schema.ts
├── .env.example
├── package.json
├── tsconfig.json
└── wrangler.toml (for Cloudflare Workers)
```

### 4.2 Hono.js Basic Setup

**src/index.ts:**

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { contractRoutes } from "./routes/contracts";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) =>
  c.json({
    message: "Hackathon API",
    version: "1.0.0",
  }),
);

app.route("/api/contracts", contractRoutes);

export default app;
```

## 5. Configuration Files Template

### 5.1 Environment Variables Guide

**.env.example:**

```
# Smart Contracts
DEPLOYER_PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...
ETHERSCAN_API_KEY=...

# Frontend
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Backend (optional)
DATABASE_URL=postgresql://...
IPFS_JWT=...
```

### 5.2 Gitignore Template

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
.next/
out/
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Smart Contracts
cache/
artifacts/
out/
typechain-types/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
```

## 6. Package Scripts

### 6.1 Root package.json Scripts

```json
{
  "scripts": {
    "dev:frontend": "cd packages/frontend && npm run dev",
    "dev:backend": "cd packages/backend && npm run dev",
    "dev:contracts": "cd packages/contracts && npm run dev",
    "build": "turbo run build",
    "build:frontend": "cd packages/frontend && npm run build",
    "build:contracts": "cd packages/contracts && npm run build",
    "test": "turbo run test",
    "test:contracts": "cd packages/contracts && npm run test",
    "lint": "turbo run lint",
    "deploy:contracts": "cd packages/contracts && npm run deploy",
    "verify:contracts": "cd packages/contracts && npm run verify"
  }
}
```

### 6.2 Contracts package.json

```json
{
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "node": "hardhat node",
    "deploy:local": "hardhat run scripts/deploy.ts --network localhost",
    "deploy:sepolia": "hardhat run scripts/deploy.ts --network sepolia",
    "deploy:polygon": "hardhat run scripts/deploy.ts --network polygon",
    "verify": "hardhat verify",
    "clean": "hardhat clean",
    "size": "hardhat size-contracts",
    "format": "prettier --write .",
    "lint": "solhint 'contracts/**/*.sol'"
  }
}
```

## 7. Quick Start Commands

### 7.1 Project Setup

```bash
# Create monorepo structure
mkdir my-hackathon-project
cd my-hackathon-project

# Initialize with npm
npm init -y

# Install workspace tools
npm install -D turbo typescript

# Create packages directories
mkdir -p packages/contracts packages/frontend packages/backend

# Setup frontend
cd packages/frontend
npx create-next-app@latest . --typescript --tailwind --eslint

# Setup contracts
cd ../contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
npx hardhat init

# Setup backend (optional)
cd ../backend
npm init -y
npm install hono @hono/node-server drizzle-orm
npm install -D typescript @types/node
```

---

## Summary

Struktur proyek yang baik akan membantu Anda:

1. **Monorepo dengan workspaces** - Mengelola multiple packages dengan mudah
2. **Organized smart contracts** - Src, test, script folders terpisah
3. **Modern frontend structure** - Next.js 14 app directory pattern
4. **Optional backend** - Hono.js setup jika diperlukan
5. **Clear configuration** - Environment variables dan gitignore

Tips terpenting:

- Setup struktur di awal hackathon sebelum coding
- Keep contracts dan frontend dalam monorepo
- Use TypeScript throughout
- Document contract addresses dan ABIs

Struktur ini optimized untuk speed dan maintainability during intense hackathon coding sessions.
