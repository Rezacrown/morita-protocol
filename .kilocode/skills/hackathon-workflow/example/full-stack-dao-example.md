# Full-Stack DAO Example - Contoh Proyek DAO Lengkap untuk Hackathon

## Overview

Contoh ini menunjukkan proyek DAO (Decentralized Autonomous Organization) lengkap yang dibangun untuk hackathon. Proyek ini mencakup smart contracts untuk governance, frontend untuk interaksi user, dan backend untuk indexing. Gunakan contoh ini sebagai reference untuk membangun proyek serupa.

## 1. Project Concept

### 1.1 Problem Statement

"DAOs suffer from low voter participation (typically <5%) because governance interfaces are complex, proposal information is scattered across multiple sources, and the voting process lacks transparency. This results in centralization of decision-making to large token holders."

### 1.2 Solution: DAOverse

**DAOverse** adalah dashboard governance yang menyederhanakan partisipasi DAO dengan:

- One-click voting dari dashboard
- Proposal analytics yang clear
- Delegation yang streamlined
- Real-time updates untuk proposal status

### 1.3 Tech Stack

| Component       | Technology                                    |
| --------------- | --------------------------------------------- |
| Blockchain      | Polygon (low fees, fast)                      |
| Smart Contracts | Solidity + Hardhat                            |
| Token Standard  | ERC20 ( governance) + Governor (OpenZeppelin) |
| Frontend        | Next.js 14 + Wagmi + Tailwind                 |
| Backend         | Hono.js (for indexing)                        |
| Database        | PostgreSQL + Prisma                           |
| Wallet          | RainbowKit                                    |

## 2. Smart Contracts

### 2.1 GovernanceToken.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20, ERC20Votes {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18;

    constructor() ERC20("DAOverse Token", "DVRS") ERC20Permit("DAOverse Token") {
        _mint(msg.sender, MAX_SUPPLY);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    // The functions below are overrides required by Solidity.
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}
```

### 2.2 GovernorContract.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { Governor } from "@openzeppelin/contracts/governance/Governor.sol";
import { ERC165 } from "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import { IVotes } from "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import { GovernorVoteLock } from "@openzeppelin/contracts/governance/extensions/GovernorVoteLock.sol";

contract DAOverseGovernor is ERC165, Governor, IVotes, GovernorVoteLock {
    IVotes public immutable token;

    uint256 public proposalCount;
    mapping(uint256 => ProposalCore) public proposals;

    struct ProposalCore {
        uint256 id;
        address proposer;
        uint256 startBlock;
        uint256 endBlock;
        string description;
        bool executed;
        bool canceled;
    }

    constructor(IVotes _token) Governor("DAOverseGovernor") GovernorVoteLock(1 days) {
        token = _token;
    }

    function votingDelay() public pure override returns (uint256) {
        return 1 days; // 1 day voting delay
    }

    function votingPeriod() public pure override returns (uint256) {
        return 5 days; // 5 days voting period
    }

    function quorum(uint256 blockNumber) public pure override returns (uint256) {
        return 10000000 * 10**18; // 10M tokens for quorum
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override
        returns (uint256)
    {
        proposalCount++;
        uint256 proposalId = super.propose(targets, values, calldatas, description);

        proposals[proposalId] = ProposalCore({
            id: proposalId,
            proposer: msg.sender,
            startBlock: block.number + votingDelay(),
            endBlock: block.number + votingDelay() + votingPeriod(),
            description: description,
            executed: false,
            canceled: false
        });

        return proposalId;
    }

    function execute(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        public
        payable
        override
        returns (uint256)
    {
        uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);
        proposals[proposalId].executed = true;

        return super.execute(targets, values, calldatas, descriptionHash);
    }

    function[] memory targets, cancel(address uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        public
        override
        returns (uint256)
    {
        uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);
        proposals[proposalId].canceled = true;

        return proposalId;
    }

    function proposalVotes(uint256 proposalId)
        public
        view
        returns (uint256 forVotes, uint256 againstVotes, uint256 abstainVotes)
    {
        return (
            proposalVotesFor(proposalId),
            proposalVotesAgainst(proposalId),
            proposalVotesAbstain(proposalId)
        );
    }

    function proposalState(uint256 proposalId)
        public
        view
        returns (
            uint256 proposalId,
            address proposer,
            uint256 startBlock,
            uint256 endBlock,
            string memory description,
            bool executed,
            bool canceled
        )
    {
        ProposalCore memory proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.startBlock,
            proposal.endBlock,
            proposal.description,
            proposal.executed,
            proposal.canceled
        );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        pure
        override(ERC165, IERC165)
        returns (bool)
    {
        return interfaceId == type(IGovernor).interfaceId || super.supportsInterface(interfaceId);
    }
}
```

### 2.3 Deployment Script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Governance Token...");

  const Token = await ethers.getContractFactory("GovernanceToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log(`Governance Token deployed to: ${tokenAddress}`);

  // Mint some tokens for testing
  const [deployer] = await ethers.getSigners();
  const mintAmount = ethers.parseEther("1000000");
  await token.mint(deployer.address, mintAmount);
  console.log(`Minted ${mintAmount} tokens to deployer`);

  console.log("Deploying Governor...");

  const Governor = await ethers.getContractFactory("DAOverseGovernor");
  const governor = await Governor.deploy(tokenAddress);
  await governor.waitForDeployment();
  const governorAddress = await governor.getAddress();

  console.log(`Governor deployed to: ${governorAddress}`);

  // Give deployer voting power by delegating
  await token.delegate(deployer.address);
  console.log("Voting power delegated");

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(`Token: ${tokenAddress}`);
  console.log(`Governor: ${governorAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 3. Frontend Implementation

### 3.1 Dashboard Page

```tsx
// src/app/page.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@/components/web3/connect-button";
import { ProposalList } from "@/components/dao/proposal-list";
import { CreateProposal } from "@/components/dao/create-proposal";
import { TokenBalance } from "@/components/dao/token-balance";

export default function Dashboard() {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">DAOverse</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to DAOverse
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Simplifying DAO governance for everyone
            </p>
            <div className="flex justify-center gap-4">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Connect Wallet to Start
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
              <TokenBalance address={address!} />
              <CreateProposal />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Active Proposals</h2>
              <ProposalList />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
```

### 3.2 Proposal List Component

```tsx
// src/components/dao/proposal-list.tsx
"use client";

import { useReadContract } from "wagmi";
import { governanceTokenABI } from "@/lib/contracts/abis";
import { GOVERNANCE_TOKEN_ADDRESS } from "@/lib/contracts/addresses";
import { formatEther } from "viem";

interface Proposal {
  id: bigint;
  proposer: string;
  startBlock: bigint;
  endBlock: bigint;
  description: string;
  executed: boolean;
  canceled: boolean;
}

export function ProposalList() {
  const { data: proposalCount } = useReadContract({
    address: GOVERNANCE_TOKEN_ADDRESS,
    abi: governanceTokenABI,
    functionName: "proposalCount",
  });

  // Mock proposal data - in production, fetch from indexer
  const proposals: Proposal[] = [
    {
      id: 1n,
      proposer: "0x1234...5678",
      startBlock: 18000000n,
      endBlock: 18005000n,
      description: "Proposal #1: Allocate treasury for marketing",
      executed: false,
      canceled: false,
    },
    {
      id: 2n,
      proposer: "0xabcd...efgh",
      startBlock: 18001000n,
      endBlock: 18006000n,
      description: "Proposal #2: Upgrade governance parameters",
      executed: false,
      canceled: false,
    },
  ];

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <div
          key={proposal.id.toString()}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{proposal.description}</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Active
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Proposed by: {proposal.proposer}
          </div>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Vote For
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Vote Against
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Abstain
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 4. Backend Implementation

### 4.1 API Routes

```typescript
// src/routes/dao.ts
import { Hono } from "hono";
import { cors } from "hono/cors";

const dao = new Hono();

dao.use("/*", cors());

// Get all proposals
dao.get("/proposals", async (c) => {
  // In production, fetch from database
  const proposals = [
    {
      id: 1,
      title: "Allocate treasury for marketing",
      description: "Proposal to allocate 50,000 DVRS for marketing activities",
      status: "active",
      votesFor: 1500000,
      votesAgainst: 200000,
      proposer: "0x1234567890123456789012345678901234567890",
    },
    {
      id: 2,
      title: "Upgrade governance parameters",
      description: "Reduce voting delay from 1 day to 2 hours",
      status: "active",
      votesFor: 800000,
      votesAgainst: 100000,
      proposer: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    },
  ];

  return c.json({ proposals });
});

// Get single proposal
dao.get("/proposals/:id", async (c) => {
  const id = c.req.param("id");

  return c.json({
    proposal: {
      id: Number(id),
      title: "Sample Proposal",
      description: "Proposal description",
      status: "active",
      votesFor: 1500000,
      votesAgainst: 200000,
      votesAbstain: 50000,
    },
  });
});

// Cast vote (would require authentication)
dao.post("/proposals/:id/vote", async (c) => {
  const id = c.req.param("id");
  const { voteType, voterAddress } = await c.req.json();

  // In production, submit transaction and store in DB

  return c.json({
    success: true,
    transactionHash: "0x...",
  });
});

// Get voter power
dao.get("/voter-power/:address", async (c) => {
  const address = c.req.param("address");

  return c.json({
    address,
    votingPower: 10000,
    delegators: 0,
  });
});

export { dao };
```

### 4.2 Indexing Service

```typescript
// src/services/indexer.ts
import { ethers } from "ethers";

const GOVERNANCE_TOKEN_ADDRESS = process.env.GOVERNANCE_TOKEN_ADDRESS!;
const GOVERNANCE_CONTRACT_ADDRESS = process.env.GOVERNANCE_CONTRACT_ADDRESS!;

// Event signatures
const PROPOSAL_CREATED_EVENT = ethers.id(
  "ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)",
);
const VOTE_CAST_EVENT = ethers.id(
  "VoteCast(address,uint256,uint8,uint256,string)",
);

export async function indexEvents() {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // In production, use The Graph or custom indexer
  // This is a simplified example

  const filter = {
    address: GOVERNANCE_CONTRACT_ADDRESS,
    topics: [PROPOSAL_CREATED_EVENT],
  };

  const logs = await provider.getLogs({
    ...filter,
    fromBlock: 0,
    toBlock: "latest",
  });

  const proposals = logs.map((log) => {
    const iface = new ethers.Interface([
      "event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
    ]);
    const parsed = iface.parseLog(log);
    return {
      id: parsed.args.proposalId,
      proposer: parsed.args.proposer,
      description: parsed.args.description,
      startBlock: parsed.args.startBlock,
      endBlock: parsed.args.endBlock,
    };
  });

  return proposals;
}
```

## 5. Demo Script

### 5.1 Demo Flow (5 minutes)

```
[0:00-0:30] OPENING
"DAOs have a problem: only 5% of token holders vote.
Today I'm showing DAOverse - making governance accessible."

[0:30-1:00] WALLET CONNECTION
- Show empty dashboard
- Click "Connect Wallet"
- MetaMask pops up
- Connect successfully
- Show dashboard with token balance

[1:00-2:00] CREATE PROPOSAL
- Click "Create Proposal"
- Fill form: "Allocate 50K for marketing"
- Click submit
- MetaMask confirms
- Transaction pending
- Success! Proposal appears in list

[2:00-3:00] VOTE ON PROPOSAL
- Click "Vote For" on proposal
- MetaMask confirms
- Show vote recorded
- Show updated vote counts

[3:00-4:00] SHOW ANALYTICS
- Click on proposal
- Show detailed view
- Show voting timeline
- Show quorum progress

[4:00-5:00] CLOSING
"That's DAOverse - governance for everyone.
Try it at daoverse.demo"
```

### 5.2 Pitch Points

1. **Problem**: Low DAO participation hurts decentralization
2. **Solution**: User-friendly dashboard with one-click voting
3. **Innovation**: Real-time proposal analytics
4. **Tech**: Built on Polygon for low fees
5. **Impact**: Could increase DAO participation from 5% to 30%+

## 6. Deployment Steps

### 6.1 Deploy to Polygon Testnet

```bash
# 1. Configure hardhat.config.ts for Polygon Mumbai
export POLYGON_MUMBAI_RPC=https://rpc-mumbai.maticvigil.com
export PRIVATE_KEY=your_private_key

# 2. Deploy contracts
cd packages/contracts
npx hardhat run scripts/deploy.ts --network polygonMumbai

# 3. Verify on Polygonscan
npx hardhat verify --network polygonMumbai <token_address>

# 4. Deploy frontend
cd packages/frontend
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x... \
NEXT_PUBLIC_GOVERNOR_ADDRESS=0x... \
npm run build
```

### 6.2 Environment Variables

```
# Frontend (.env.local)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GOVERNOR_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=80001

# Backend (.env)
DATABASE_URL=postgresql://...
RPC_URL=https://rpc-mumbai.maticvigil.com
GOVERNANCE_TOKEN_ADDRESS=0x...
GOVERNANCE_CONTRACT_ADDRESS=0x...
```

---

## Summary

Proyek DAO ini menunjukkan bagaimana membangun:

1. **Smart Contracts** - ERC20 governance token dengan OpenZeppelin Governor
2. **Frontend** - Next.js dashboard dengan Wagmi integration
3. **Backend** - Hono.js API untuk indexing dan analytics
4. **Demo** - Complete walkthrough dalam 5 menit

Tips untuk hackathon:

- Focus pada satu core feature (voting) dan make it work perfectly
- Gunakan Polygon untuk low fees dan fast confirmation
- Prepare backup (screenshots, video) jika demo fails
- Practice demo multiple times sebelum presentation

Proyek ini bisa di-extend dengan:

- Quadratic voting
- Delegation system
- Multi-sig treasury
- Proposal templates
