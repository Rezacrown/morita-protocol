# Contoh Project DeFi Staking di Starknet

Panduan lengkap untuk membuat DeFi staking contract dengan reward system di Starknet.

## Kontrak yang Dibutuhkan

1. **Reward Token** - Token untuk reward (misal: STK)
2. **Staking Contract** - Kontrak utama untuk staking

## Struktur Project

```
defi_staking/
├── Scarb.toml
└── src/
    ├── staking.cairo
    └── lib.cairo
```

## Step 1: Konfigurasi Scarb

```toml
[package]
name = "defi_staking"
version = "0.1.0"
edition = "2024_07"

[dependencies]
starknet = "2.0.0"
openzeppelin = "0.20.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

## Step 2: Staking Contract

Buat file `src/staking.cairo`:

```cairo
use starknet::ContractAddress;
use starknet::get_block_timestamp;
use openzeppelin::token::erc20::ERC20Component::{ERC20Impl, ERC20MetadataImpl};
use openzeppelin::access::ownable::OwnableComponent;

component!(path: ERC20Component, storage: reward_token, event: RewardTokenEvent);
component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

#[storage]
struct Storage {
    #[substorage(v0)]
    reward_token: ERC20Component::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    staking_token: ContractAddress,
    reward_per_second: u256,
    last_update_time: u64,
    accumulated_reward_per_share: u256,
    total_staked: u256,
    user_info: LegacyMap<ContractAddress, UserInfo>,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct UserInfo {
    amount: u256,
    reward_debt: u256,
}

#[event]
enum Event {
    #[flat]
    RewardTokenEvent: ERC20Component::Event,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
    Stake: StakeEvent,
    Withdraw: WithdrawEvent,
    RewardClaimed: RewardClaimedEvent,
}

#[derive(Drop, Serde, starknet::Encode)]
struct StakeEvent {
    user: ContractAddress,
    amount: u256,
}

#[derive(Drop, Serde, starknet::Encode)]
struct WithdrawEvent {
    user: ContractAddress,
    amount: u256,
}

#[derive(Drop, Serde, starknet::Encode)]
struct RewardClaimedEvent {
    user: ContractAddress,
    reward: u256,
}

#[constructor]
fn constructor(
    ref self: ContractState,
    reward_token: ContractAddress,
    owner: ContractAddress,
    reward_per_second: u256
) {
    self.reward_token.initializer('Staking Reward', 'STKR');
    self.ownable.initializer(owner);
    self.staking_token = reward_token;
    self.reward_per_second = reward_per_second;
    self.last_update_time = get_block_timestamp();
}

#[external(v0)]
impl StakingImpl of IStaking {
    fn stake(ref self: ContractState, amount: u256) {
        let caller = starknet::get_caller_address();
        assert(amount.low > 0, 'Cannot stake 0');

        // Update rewards
        self._update_reward(caller);

        // Transfer staking token
        let staking_token = IERC20Dispatcher { contract_address: self.staking_token.read() };
        staking_token.transfer_from(caller, starknet::get_contract_address(), amount);

        // Update user info
        let mut user_info = self.user_info.read(caller);
        user_info.amount += amount;
        self.user_info.write(caller, user_info);

        // Update total staked
        self.total_staked.write(self.total_staked.read() + amount);

        self.emit(Stake { user: caller, amount });
    }

    fn withdraw(ref self: ContractState, amount: u256) {
        let caller = starknet::get_caller_address();
        let user_info = self.user_info.read(caller);

        assert(user_info.amount >= amount, 'Insufficient staked');

        // Update rewards
        self._update_reward(caller);

        // Transfer staking token
        let staking_token = IERC20Dispatcher { contract_address: self.staking_token.read() };
        staking_token.transfer(caller, amount);

        // Update user info
        let mut updated_info = user_info;
        updated_info.amount -= amount;
        self.user_info.write(caller, updated_info);

        // Update total staked
        self.total_staked.write(self.total_staked.read() - amount);

        self.emit(Withdraw { user: caller, amount });
    }

    fn claim_reward(ref self: ContractState) {
        let caller = starknet::get_caller_address();
        self._update_reward(caller);

        let user_info = self.user_info.read(caller);
        let pending = (user_info.amount * self.accumulated_reward_per_share.read() / 1e18)
            - user_info.reward_debt;

        assert(pending.low > 0, 'No pending reward');

        // Mint rewards
        self.reward_token.mint(caller, pending);

        // Update reward debt
        let mut updated_info = user_info;
        updated_info.rebt = user_info.amount * self.accumulated_reward_per_share.read() / 1e18;
        self.user_info.write(caller, updated_info);

        self.emit(RewardClaimed { user: caller, reward: pending });
    }

    fn pending_reward(self: @ContractState, user: ContractAddress) -> u256 {
        let user_info = self.user_info.read(user);
        let acc_reward_per_share = self.accumulated_reward_per_share.read();

        (user_info.amount * acc_reward_per_share / 1e18) - user_info.reward_debt
    }
}

trait IStaking {
    fn stake(amount: u256);
    fn withdraw(amount: u256);
    fn claim_reward();
    fn pending_reward(user: ContractAddress) -> u256;
}

impl IStakingImpl of IStaking {
    fn stake(ref self: ContractState, amount: u256) {
        StakingImpl::stake(ref self, amount);
    }
    fn withdraw(ref self: ContractState, amount: u256) {
        StakingImpl::withdraw(ref self, amount);
    }
    fn claim_reward(ref self: ContractState) {
        StakingImpl::claim_reward(ref self);
    }
    fn pending_reward(self: @ContractState, user: ContractAddress) -> u256 {
        StakingImpl::pending_reward(self, user)
    }
}

#[generate_trait]
impl PrivateImpl of PrivateTrait {
    fn _update_reward(ref self: ContractState, user: ContractAddress) {
        let current_time = get_block_timestamp();
        let last_time = self.last_update_time.read();

        if self.total_staked.read() > 0 {
            let time_diff = current_time - last_time;
            let reward = self.reward_per_second.read() * time_diff;
            self.accumulated_reward_per_share.write(
                self.accumulated_reward_per_share.read() + (reward * 1e18 / self.total_staked.read())
            );
        }

        self.last_update_time.write(current_time);

        let user_info = self.user_info.read(user);
        let new_debt = user_info.amount * self.accumulated_reward_per_share.read() / 1e18;
        let mut updated_info = user_info;
        updated_info.reward_debt = new_debt;
        self.user_info.write(user, updated_info);
    }
}
```

## Step 3: Testing

```cairo
use starknet::ContractAddress;
use defi_staking::staking::Staking;

#[test]
fn test_stake() {
    let user: ContractAddress = starknet::contract_address_const::<0x123>();
    set_caller_address(user);

    Staking::stake(u256 { low: 1000, high: 0 });

    let balance = Staking::user_info(user);
    assert(balance.amount.low == 1000, 'wrong amount');
}

#[test]
fn test_pending_reward() {
    let user: ContractAddress = starknet::contract_address_const::<0x123>();

    let pending = Staking::pending_reward(user);
    // Verify pending reward calculation
}
```

## Step 4: Integrasi dengan starknet.js

### Setup Frontend

```bash
npm install starknet@^9.2.1
```

### Interaksi dengan Staking Contract

```typescript
import { Account, Contract, json } from "starknet";

const STAKING_ABI = json.parse([
  "function stake(amount: u256)",
  "function withdraw(amount: u256)",
  "function claim_reward()",
  "function pending_reward(user: ContractAddress) -> u256",
  "function user_info(address) -> (amount: u256, reward_debt: u256)",
  "event Stake(user: ContractAddress, amount: u256)",
  "event Withdraw(user: ContractAddress, amount: u256)",
  "event RewardClaimed(user: ContractAddress, reward: u256)",
]);

const stakingAddress = "0x...";
const staking = new Contract(STAKING_ABI, stakingAddress, account);

// Stake tokens
const amount = parseEther("100"); // 100 tokens
await staking.stake(amount);

// Check pending rewards
const pending = await staking.pending_reward(account.address);
console.log("Pending rewards:", formatEther(pending));

// Claim rewards
await staking.claim_reward();

// Withdraw staked tokens
await staking.withdraw(amount);
```

## Step 5: Event Handling

```typescript
import { Provider, EventFilter } from "starknet";

const provider = new Provider({ sequencer: { network: "mainnet-alpha" } });

// Listen for stake events
const stakeFilter: EventFilter = {
  address: stakingAddress,
  from_block: "latest",
  keys: [starknet.hash.starknetKeccak("Stake").toString()],
};

// Get past events
const events = await provider.getEvents(stakeFilter);
events.events.forEach((event) => {
  console.log("Stake:", {
    user: event.data[0],
    amount: event.data[1],
  });
});
```

## Frontend Integration Hint

### React Hook Example

```typescript
import { useState, useEffect } from "react";
import { useStarknet } from "@starknet-react/core";

function useStaking() {
  const { account, contracts } = useStarknet();
  const [stakedAmount, setStakedAmount] = useState(BigInt(0));
  const [pendingRewards, setPendingRewards] = useState(BigInt(0));

  useEffect(() => {
    if (!account || !contracts.staking) return;

    const loadData = async () => {
      const info = await contracts.staking.user_info(account);
      const pending = await contracts.staking.pending_reward(account);

      setStakedAmount(info.amount);
      setPendingRewards(pending);
    };

    loadData();
  }, [account, contracts.staking]);

  return { stakedAmount, pendingRewards };
}
```

## Security Considerations

1. **Reward calculation**: Gunakan SafeMath untuk mencegah overflow
2. **Access control**: Hanya owner yang bisa set reward rate
3. **Reentrancy**: Cairo inherently safe, tapi tetap gunakan checks-effects-interactions
4. **Precision**: Gunakan fixed-point arithmetic untuk reward calculation

## Referensi

- [Starknet Documentation](https://docs.starknet.io/)
- [starknet.js](https://www.starknet-react.com/)
- [DeFi Best Practices](https://docs.starknet.io/ecosystem/security/)
