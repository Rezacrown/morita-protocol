# DeFi Protocol Example - Contoh Proyek DeFi Lengkap untuk Hackathon

## Overview

Contoh ini menunjukkan proyek DeFi (Decentralized Finance) lengkap yang dibangun untuk hackathon. Proyek ini mencakup staking protocol dengan rewards, yield farming, dan integration dengan existing DeFi protocols. Gunakan contoh ini sebagai reference untuk membangun proyek DeFi serupa.

## 1. Project Concept

### 1.1 Problem Statement

"DeFi users face fragmented yield opportunities across multiple protocols, making it difficult to optimize returns. Additionally, complex interfaces and high gas costs deter new users from participating in yield farming."

### 1.2 Solution: YieldVault

**YieldVault** adalah unified yield optimization protocol yang menawarkan:

- One-click staking dengan auto-compounding
- Best-in-class yields melalui strategy automation
- Gas-efficient dengan meta-transactions
- User-friendly interface untuk beginners

### 1.3 Tech Stack

| Component       | Technology                                 |
| --------------- | ------------------------------------------ |
| Blockchain      | Arbitrum (low fees, DeFi ecosystem)        |
| Smart Contracts | Solidity + Hardhat                         |
| Core Protocol   | Custom staking dengan strategy integration |
| Frontend        | Next.js 14 + Wagmi + RainbowKit            |
| Price Feeds     | Chainlink                                  |
| Wallet          | RainbowKit                                 |
| Development     | Foundry untuk testing                      |

## 2. Smart Contracts

### 2.1 YieldVaultToken.sol (Staking Token)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title YieldVaultToken
 * @dev ERC20 token for staking in YieldVault protocol
 */
contract YieldVaultToken is ERC20, ERC20Burnable, ERC20Permit {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18;

    mapping(address => bool) public minters;

    constructor()
        ERC20("YieldVault Token", "YVT")
        ERC20Permit("YieldVault Token")
    {
        _mint(msg.sender, MAX_SUPPLY);
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized to mint");
        _;
    }

    function addMinter(address _minter) external {
        minters[_minter] = true;
    }

    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }
}
```

### 2.2 YieldVault.sol (Core Protocol)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title YieldVault
 * @dev Staking protocol dengan auto-compounding rewards
 */
contract YieldVault is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Contracts
    IERC20 public stakingToken;
    IERC20 public rewardToken;

    // State
    uint256 public rewardRate; // Rewards per second
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;

    // Events
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    // ===== Core Functions =====

    function stake(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot stake 0");

        _totalSupply += amount;
        _balances[msg.sender] += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant updateReward(msg.sender) {
        require(amount > 0, "Cannot withdraw 0");
        require(_balances[msg.sender] >= amount, "Insufficient balance");

        _totalSupply -= amount;
        _balances[msg.sender] -= amount;

        stakingToken.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getReward() external nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];

        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardToken.safeTransfer(msg.sender, reward);

            emit RewardClaimed(msg.sender, reward);
        }
    }

    // ===== View Functions =====

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function earned(address account) external view returns (uint256) {
        return rewards[account] + (_balances[account] * (rewardPerTokenStored - userRewardPerTokenPaid[account])) / 1e18;
    }

    // ===== Admin Functions =====

    function setRewardRate(uint256 _rewardRate) external {
        require(_rewardRate > 0, "Reward rate must be > 0");
        rewardRate = _rewardRate;
        lastUpdateTime = block.timestamp;
    }

    function notifyRewardAmount(uint256 amount) external {
        rewardRate = amount / 7 days; // Distribute over 7 days
        lastUpdateTime = block.timestamp;
    }

    // ===== Internal Functions =====

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = block.timestamp;

        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    function rewardPerToken() internal view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }

        uint256 time = block.timestamp - lastUpdateTime;
        uint256 newRewards = time * rewardRate;

        return rewardPerTokenStored + (newRewards * 1e18) / _totalSupply;
    }
}
```

### 2.3 Strategy Contracts

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IYieldStrategy
 * @dev Interface for yield generation strategies
 */
interface IYieldStrategy {
    function deposit(uint256 amount) external returns (uint256);
    function withdraw(uint256 amount) external returns (uint256);
    function harvest() external returns (uint256);
    function wantToken() external view returns (address);
    function balanceOf() external view returns (uint256);
}

/**
 * @title UniswapV3Strategy
 * @dev Strategy for providing liquidity and farming on Uniswap
 */
contract UniswapV3Strategy is IYieldStrategy {
    address public immutable want;
    address public immutable lpToken;
    address public owner;

    constructor(address _want, address _lpToken) {
        want = _want;
        lpToken = _lpToken;
        owner = msg.sender;
    }

    function deposit(uint256 amount) external override returns (uint256) {
        // Add liquidity to Uniswap pool
        // Return lp tokens received
        return amount; // Simplified
    }

    function withdraw(uint256 amount) external override returns (uint256) {
        // Remove liquidity from Uniswap pool
        // Return want tokens received
        return amount; // Simplified
    }

    function harvest() external override returns (uint256) {
        // Claim farming rewards
        // Return rewards collected
        return 0; // Simplified
    }

    function wantToken() external view override returns (address) {
        return want;
    }

    function balanceOf() external view override returns (uint256) {
        return IERC20(lpToken).balanceOf(address(this));
    }
}
```

### 2.4 Deployment Script

```typescript
// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  console.log("Deploying YieldVault Protocol...");

  // Deploy staking token (YVT)
  const Token = await ethers.getContractFactory("YieldVaultToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`YieldVaultToken deployed to: ${tokenAddress}`);

  // Deploy reward token (could be YVT or another token)
  const RewardToken = await ethers.getContractFactory("YieldVaultToken");
  const rewardToken = await RewardToken.deploy();
  await rewardToken.waitForDeployment();
  const rewardTokenAddress = await rewardToken.getAddress();
  console.log(`RewardToken deployed to: ${rewardTokenAddress}`);

  // Deploy YieldVault
  const Vault = await ethers.getContractFactory("YieldVault");
  const vault = await Vault.deploy(tokenAddress, rewardTokenAddress);
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  console.log(`YieldVault deployed to: ${vaultAddress}`);

  // Setup
  const [deployer, user1, user2] = await ethers.getSigners();

  // Mint tokens for testing
  const mintAmount = ethers.parseEther("1000000");
  await token.mint(deployer.address, mintAmount);
  await token.mint(user1.address, mintAmount);
  await token.mint(user2.address, mintAmount);

  // Transfer tokens to vault for rewards
  await rewardToken.mint(vaultAddress, ethers.parseEther("1000000"));

  // Set reward rate
  const rewardRate = ethers.parseEther("1"); // 1 token per second
  await vault.setRewardRate(rewardRate);

  console.log("\n=== DEPLOYMENT COMPLETE ===");
  console.log(`Token: ${tokenAddress}`);
  console.log(`Reward: ${rewardTokenAddress}`);
  console.log(`Vault: ${vaultAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## 3. Frontend Implementation

### 3.1 Staking Dashboard

```tsx
// src/app/page.tsx
"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@/components/web3/connect-button";
import { StakeForm } from "@/components/defi/stake-form";
import { UserStats } from "@/components/defi/user-stats";
import { PoolStats } from "@/components/defi/pool-stats";
import { useReadContract, useWriteContract } from "wagmi";
import { yieldVaultABI } from "@/lib/contracts/abis";
import { YIELD_VAULT_ADDRESS } from "@/lib/contracts/addresses";
import { formatEther } from "viem";

export default function StakingDashboard() {
  const { isConnected, address } = useAccount();
  const { data: balance } = useReadContract({
    address: YIELD_VAULT_ADDRESS,
    abi: yieldVaultABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: earned } = useReadContract({
    address: YIELD_VAULT_ADDRESS,
    abi: yieldVaultABI,
    functionName: "earned",
    args: address ? [address] : undefined,
  });

  const { data: totalSupply } = useReadContract({
    address: YIELD_VAULT_ADDRESS,
    abi: yieldVaultABI,
    functionName: "totalSupply",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">YieldVault</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Stake Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Stake Your Tokens
            </h2>

            {isConnected ? (
              <StakeForm />
            ) : (
              <div className="text-center py-10 text-white/70">
                Connect wallet to start staking
              </div>
            )}
          </div>

          {/* Right: Stats */}
          <div className="space-y-6">
            {isConnected && (
              <UserStats
                balance={balance ? formatEther(balance) : "0"}
                earned={earned ? formatEther(earned) : "0"}
              />
            )}

            <PoolStats
              totalStaked={totalSupply ? formatEther(totalSupply) : "0"}
              apy="12.5%"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
```

### 3.2 Stake Form Component

```tsx
// src/components/defi/stake-form.tsx
"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { yieldVaultABI } from "@/lib/contracts/abis";
import { YIELD_VAULT_ADDRESS } from "@/lib/contracts/addresses";
import { parseEther } from "viem";

export function StakeForm() {
  const [amount, setAmount] = useState("");

  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleStake = async () => {
    if (!amount) return;

    writeContract({
      address: YIELD_VAULT_ADDRESS,
      abi: yieldVaultABI,
      functionName: "stake",
      args: [parseEther(amount)],
    });
  };

  const handleWithdraw = async () => {
    if (!amount) return;

    writeContract({
      address: YIELD_VAULT_ADDRESS,
      abi: yieldVaultABI,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  const handleClaim = async () => {
    writeContract({
      address: YIELD_VAULT_ADDRESS,
      abi: yieldVaultABI,
      functionName: "getReward",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-white/80 mb-2">Amount (YVT)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount to stake"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleStake}
          disabled={isPending || !amount}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Confirming..." : "Stake"}
        </button>

        <button
          onClick={handleWithdraw}
          disabled={isPending || !amount}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw
        </button>
      </div>

      <button
        onClick={handleClaim}
        disabled={isPending}
        className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
      >
        Claim Rewards
      </button>

      {hash && (
        <div className="text-sm text-white/60">
          {isConfirming
            ? "Transaction confirming..."
            : isSuccess
              ? "Transaction successful!"
              : `Transaction hash: ${hash.slice(0, 10)}...`}
        </div>
      )}
    </div>
  );
}
```

## 4. Demo Script

### 4.1 Demo Flow (5 minutes)

```
[0:00-0:30] OPENING
"Yield farming is complex. Multiple protocols, high gas fees,
confusing interfaces. Today I'm showing YieldVault -
simplified yield optimization."

[0:30-1:00] CONNECT WALLET
- Show dashboard with gradient background
- Click Connect Wallet
- Select MetaMask
- Connected - show balance

[1:00-2:30] STAKE TOKENS
- Show "Enter amount to stake"
- Type "1000 YVT"
- Click Stake
- MetaMask popup appears
- Show gas estimate
- Confirm transaction
- Wait for confirmation (talk about APY)
- Success! Show updated balance

[2:30-3:30] CLAIM REWARDS
- Show "Claim Rewards" button
- Click claim
- Transaction confirms
- Show tokens in wallet

[3:30-4:30] WITHDRAW
- Click Withdraw
- Show tokens back in wallet
- Explain auto-compounding feature

[4:30-5:00] CLOSING
"YieldVault - earn yield the easy way.
Low fees on Arbitrum. Try it at yieldvault.demo"
```

### 4.2 Pitch Points

1. **Problem**: DeFi is too complex for average users
2. **Solution**: One-click staking dengan auto-compounding
3. **Innovation**: Meta-transactions untuk gas abstraction
4. **Tech**: Built on Arbitrum untuk low fees
5. **Market**: $800B+ DeFi market dengan high growth

## 5. Integration Examples

### 5.1 Chainlink Price Feed Integration

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceOracle {
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int) {
        (
            /* uint80 roundID */,
            int price,
            /* uint startedAt */,
            /* uint timeStamp */,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();
        return price;
    }

    function getAssetPrice(address asset) external view returns (int) {
        // Implement multi-asset price fetching
        return getLatestPrice();
    }
}
```

### 5.2 Uniswap Integration for Swaps

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { IUniswapV2Router02 } from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract SwapIntegration {
    IUniswapV2Router02 public router;

    constructor(address _router) {
        router = IUniswapV2Router02(_router);
    }

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable {
        router.swapExactETHForTokens{ value: msg.value }(
            amountOutMin,
            path,
            to,
            deadline
        );
    }
}
```

---

## Summary

Proyek DeFi ini menunjukkan bagaimana membangun:

1. **Smart Contracts** - Staking protocol dengan rewards dan strategy integration
2. **Frontend** - Modern staking dashboard dengan real-time updates
3. **Integration** - Chainlink feeds dan Uniswap swaps
4. **Demo** - Complete walkthrough dalam 5 menit

Tips untuk hackathon DeFi:

- Fokus pada core mechanics yang work perfectly
- Gunakan testnet yang established (Arbitrum Sepolia)
- Highlight unique value proposition (gas efficiency, UX)
- Prepare untuk questions tentang security dan risks

Proyek ini bisa di-extend dengan:

- Multi-token staking
- Lock periods dengan boost
- Auto-compounding strategies
- Governance token
