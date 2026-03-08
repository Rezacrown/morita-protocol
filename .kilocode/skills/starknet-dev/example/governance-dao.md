# Contoh Project DAO Governance di Starknet

Panduan lengkap untuk membuat DAO governance dengan proposal system, voting mechanism, dan timelock controller di Starknet.

## Kontrak yang Dibutuhkan

1. **Governance Token** - ERC20 dengan voting power (Governance token)
2. **Governor** - Contract untuk proposal dan voting
3. **Timelock** - Delay sebelum proposal dieksekusi
4. **Treasury** - Manage DAO funds

## Struktur Project

```
dao_governance/
├── Scarb.toml
├── src/
│   ├── governance_token.cairo
│   ├── governor.cairo
│   ├── timelock.cairo
│   └── lib.cairo
└── tests/
    └── test_governance.cairo
```

## Step 1: Konfigurasi Scarb

```toml
[package]
name = "dao_governance"
version = "0.1.0"
edition = "2024_07"

[dependencies]
starknet = "2.0.0"
openzeppelin = "0.20.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

## Step 2: Governance Token (ERC20 Votes)

Buat file `src/governance_token.cairo`:

```cairo
use starknet::ContractAddress;
use openzeppelin::token::erc20::ERC20Component;
use openzeppelin::access::ownable::OwnableComponent;
use openzeppelin::governance::votes::VotesComponent;

component!(path: ERC20Component, storage: erc20, event: ERC20Event);
component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
component!(path: VotesComponent, storage: votes, event: VotesEvent);

#[storage]
struct Storage {
    #[substorage(v0)]
    erc20: ERC20Component::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    #[substorage(v0)]
    votes: VotesComponent::Storage,
}

#[event]
enum Event {
    #[flat]
    ERC20Event: ERC20Component::Event,
    #[flat]
    OwnableEvent: OwnableComponent::Event,
    #[flat]
    VotesEvent: VotesComponent::Event,
}

#[abi(embed_v0)]
impl ERC20Impl = ERC20Component::ERC20Impl<ContractState>;
#[abi(embed_v0)]
impl ERC20MetadataImpl = ERC20Component::ERC20MetadataImpl<ContractState>;
impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;
impl VotesImpl = VotesComponent::VotesImpl<ContractState>;
impl VotesInternalImpl = VotesComponent::InternalImpl<ContractState>;

#[abi(embed_v0)]
impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

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

#[external(v0)]
impl TokenVotesImpl of ITokenVotes {
    fn mint(ref self: ContractState, to: ContractAddress, amount: u256) {
        self.ownable.assert_only_owner();
        self.erc20.mint(to, amount);
        self.votes._mint(to, amount);
    }

    fn delegate(ref self: ContractState, delegatee: ContractAddress) {
        let sender = starknet::get_caller_address();
        self.votes.delegate(sender, delegatee);
    }

    fn get_votes(self: @ContractState, account: ContractAddress) -> u256 {
        self.votes.get_votes(account)
    }
}

trait ITokenVotes {
    fn mint(to: ContractAddress, amount: u256);
    fn delegate(delegatee: ContractAddress);
    fn get_votes(account: ContractAddress) -> u256;
}
```

## Step 3: Governor Contract

Buat file `src/governor.cairo`:

```cairo
use starknet::ContractAddress;
use starknet::get_block_timestamp;
use starknet::get_caller_address;
use openzeppelin::governance::votes::VotesComponent::VotesComponent;
use openzeppelin::access::ownable::OwnableComponent;
use starknet::storage::Map;

const PROPOSAL_STATE_PENDING: u8 = 0;
const PROPOSAL_STATE_ACTIVE: u8 = 1;
const PROPOSAL_STATE_CANCELED: u8 = 2;
const PROPOSAL_STATE_DEFEATED: u8 = 3;
const PROPOSAL_STATE_SUCCEEDED: u8 = 4;
const PROPOSAL_STATE_EXECUTED: u8 = 5;

component!(path: VotesComponent, storage: votes, event: VotesEvent);
component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

#[storage]
struct Storage {
    #[substorage(v0)]
    votes: VotesComponent::Storage,
    #[substorage(v0)]
    ownable: OwnableComponent::Storage,
    timelock: ContractAddress,
    voting_delay: u64,
    voting_period: u64,
    proposal_threshold: u256,
    quorum: u256,
    proposal_count: u256,
    proposals: Map<u256, Proposal>,
    votes_cast: Map<(u256, ContractAddress), bool>,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct Proposal {
    id: u256,
    proposer: ContractAddress,
    target: ContractAddress,
    calldata: Span<felt252>,
    start_time: u64,
    end_time: u64,
    for_votes: u256,
    against_votes: u256,
    canceled: bool,
    executed: bool,
}

#[event]
enum Event {
    ProposalCreated: ProposalCreatedEvent,
    VoteCast: VoteCastEvent,
    ProposalExecuted: ProposalExecutedEvent,
    ProposalCanceled: ProposalCanceledEvent,
}

#[derive(Drop, Serde, starknet::Encode)]
struct ProposalCreatedEvent {
    proposal_id: u256,
    proposer: ContractAddress,
    target: ContractAddress,
    start_time: u64,
    end_time: u64,
}

#[derive(Drop, Serde, starknet::Encode)]
struct VoteCastEvent {
    voter: ContractAddress,
    proposal_id: u256,
    support: bool,
    votes: u256,
}

#[derive(Drop, Serde, starknet::Encode)]
struct ProposalExecutedEvent {
    proposal_id: u256,
}

#[derive(Drop, Serde, starknet::Encode)]
struct ProposalCanceledEvent {
    proposal_id: u256,
}

#[constructor]
fn constructor(
    ref self: ContractState,
    governance_token: ContractAddress,
    timelock: ContractAddress,
    voting_delay: u64,
    voting_period: u64,
    proposal_threshold: u256,
    quorum: u256,
    owner: ContractAddress
) {
    self.votes.initializer(governance_token);
    self.ownable.initializer(owner);
    self.timelock = timelock;
    self.voting_delay = voting_delay;
    self.voting_period = voting_period;
    self.proposal_threshold = proposal_threshold;
    self.quorum = quorum;
}

#[external(v0)]
impl GovernorImpl of IGovernor {
    fn propose(
        ref self: ContractState,
        target: ContractAddress,
        calldata: Span<felt252>,
        description: felt252
    ) -> u256 {
        let proposer = get_caller_address();

        // Check proposal threshold
        let proposer_votes = self.votes.get_votes(proposer);
        assert(proposer_votes >= self.proposal_threshold.read(), 'Below threshold');

        // Create proposal
        let proposal_id = self.proposal_count.read() + u256 { low: 1, high: 0 };
        let current_time = get_block_timestamp();

        let proposal = Proposal {
            id: proposal_id,
            proposer,
            target,
            calldata,
            start_time: current_time + self.voting_delay.read(),
            end_time: current_time + self.voting_delay.read() + self.voting_period.read(),
            for_votes: u256 { low: 0, high: 0 },
            against_votes: u256 { low: 0, high: 0 },
            canceled: false,
            executed: false,
        };

        self.proposals.write(proposal_id, proposal);
        self.proposal_count.write(proposal_id);

        self.emit(ProposalCreatedEvent {
            proposal_id,
            proposer,
            target,
            start_time: proposal.start_time,
            end_time: proposal.end_time,
        });

        proposal_id
    }

    fn cast_vote(ref self: ContractState, proposal_id: u256, support: bool) {
        let voter = get_caller_address();
        let proposal = self.proposals.read(proposal_id);

        // Verify proposal is active
        let current_time = get_block_timestamp();
        assert(current_time >= proposal.start_time, 'Not started');
        assert(current_time <= proposal.end_time, 'Ended');

        // Check voting power
        let votes = self.votes.get_votes(voter);
        assert(votes > u256 { low: 0, high: 0 }, 'No voting power');

        // Record vote
        assert(!self.votes_cast.read((proposal_id, voter)), 'Already voted');
        self.votes_cast.write((proposal_id, voter), true);

        // Update vote counts
        let mut updated_proposal = proposal;
        if support {
            updated_proposal.for_votes += votes;
        } else {
            updated_proposal.against_votes += votes;
        }
        self.proposals.write(proposal_id, updated_proposal);

        self.emit(VoteCastEvent {
            voter,
            proposal_id,
            support,
            votes,
        });
    }

    fn execute(ref self: ContractState, proposal_id: u256) {
        let proposal = self.proposals.read(proposal_id);

        // Check proposal succeeded
        let total_votes = proposal.for_votes + proposal.against_votes;
        assert(total_votes >= self.quorum.read(), 'Quorum not reached');
        assert(proposal.for_votes > proposal.against_votes, 'Defeated');

        // Check timelock delay passed
        let current_time = get_block_timestamp();
        // Assume timelock provides execute after delay
        assert(current_time >= proposal.end_time, 'Timelock not passed');

        // Mark as executed
        let mut updated_proposal = proposal;
        updated_proposal.executed = true;
        self.proposals.write(proposal_id, updated_proposal);

        self.emit(ProposalExecutedEvent { proposal_id });
    }

    fn cancel(ref self: ContractState, proposal_id: u256) {
        let proposal = self.proposals.read(proposal_id);
        let caller = get_caller_address();

        // Only proposer or owner can cancel
        assert(caller == proposal.proposer || caller == self.ownable.owner(), 'Not authorized');

        let mut updated_proposal = proposal;
        updated_proposal.canceled = true;
        self.proposals.write(proposal_id, updated_proposal);

        self.emit(ProposalCanceledEvent { proposal_id });
    }

    fn state(self: @ContractState, proposal_id: u256) -> u8 {
        let proposal = self.proposals.read(proposal_id);

        if proposal.canceled {
            PROPOSAL_STATE_CANCELED
        } else if proposal.executed {
            PROPOSAL_STATE_EXECUTED
        } else {
            let current_time = get_block_timestamp();
            if current_time < proposal.start_time {
                PROPOSAL_STATE_PENDING
            } else if current_time <= proposal.end_time {
                PROPOSAL_STATE_ACTIVE
            } else if proposal.for_votes > proposal.against_votes {
                PROPOSAL_STATE_SUCCEEDED
            } else {
                PROPOSAL_STATE_DEFEATED
            }
        }
    }
}

trait IGovernor {
    fn propose(target: ContractAddress, calldata: Span<felt252>, description: felt252) -> u256;
    fn cast_vote(proposal_id: u256, support: bool);
    fn execute(proposal_id: u256);
    fn cancel(proposal_id: u256);
    fn state(proposal_id: u256) -> u8;
}
```

## Step 4: Timelock Controller

Buat file `src/timelock.cairo`:

```cairo
use starknet::ContractAddress;
use starknet::get_block_timestamp;
use starknet::storage::Map;

const CANCELLER_ROLE: felt252 = 'CANCELLER';
const EXECUTOR_ROLE: felt252 = 'EXECUTOR';
const PROPOSER_ROLE: felt252 = 'PROPOSER';

#[storage]
struct Storage {
    delay: u64,
    pending_calls: Map<felt252, Call>,
    pending_calls_timestamp: Map<felt252, u64>,
}

#[derive(Copy, Drop, Serde, starknet::Store)]
struct Call {
    to: ContractAddress,
    selector: felt252,
    calldata: Span<felt252>,
}

#[event]
enum Event {
    CallScheduled: CallScheduledEvent,
    CallExecuted: CallExecutedEvent,
    CallCanceled: CallCanceledEvent,
}

#[derive(Drop, Serde, starknet::Encode)]
struct CallScheduledEvent {
    id: felt252,
    index: u64,
    caller: ContractAddress,
}

#[derive(Drop, Serde, starknet::Encode)]
struct CallExecutedEvent {
    id: felt252,
    caller: ContractAddress,
}

#[derive(Drop, Serde, starknet::Encode)]
struct CallCanceledEvent {
    id: felt252,
    caller: ContractAddress,
}

#[constructor]
fn constructor(ref self: ContractState, min_delay: u64, owner: ContractAddress) {
    self.delay = min_delay;
}

#[external(v0)]
impl TimelockImpl of ITimelock {
    fn schedule(
        ref self: ContractState,
        to: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>,
        predecessor: felt252,
        salt: felt252
    ) -> felt252 {
        let caller = starknet::get_caller_address();

        // Generate unique ID
        let id = starknet::keccak256(
            format!(
                "{}{}{}{}{}",
                caller.into(),
                to.into(),
                selector,
                predecessor,
                salt
            )
        );

        let call = Call { to, selector, calldata };
        self.pending_calls.write(id, call);
        self.pending_calls_timestamp.write(id, get_block_timestamp() + self.delay.read());

        self.emit(CallScheduledEvent { id, index: 0, caller });
        id
    }

    fn execute(
        ref self: ContractState,
        to: ContractAddress,
        selector: felt252,
        calldata: Span<felt252>
    ) {
        // Simplified execute - in production calculate actual ID
        let caller = starknet::get_caller_address();

        self.emit(CallExecutedEvent { id: 0, caller });
    }

    fn cancel(ref self: ContractState, id: felt252) {
        let caller = starknet::get_caller_address();

        // Clear pending call
        // In production, implement proper access control
        self.pending_calls_timestamp.write(id, 0);

        self.emit(CallCanceledEvent { id, caller });
    }
}

trait ITimelock {
    fn schedule(to: ContractAddress, selector: felt252, calldata: Span<felt252>, predecessor: felt252, salt: felt252) -> felt252;
    fn execute(to: ContractAddress, selector: felt252, calldata: Span<felt252>);
    fn cancel(id: felt252);
}
```

## Step 5: Testing

```cairo
use starknet::ContractAddress;
use dao_governance::governor::Governor;
use dao_governance::governance_token::GovernanceToken;

#[test]
fn test_propose() {
    let proposer: ContractAddress = starknet::contract_address_const::<0x123>();
    set_caller_address(proposer);

    // Give proposer voting power
    GovernanceToken::delegate(proposer);

    let proposal_id = Governor::propose(
        target_contract,
        calldata,
        'Description'
    );

    assert(proposal_id.low == 1, 'wrong proposal id');
}

#[test]
fn test_vote() {
    let voter: ContractAddress = starknet::contract_address_const::<0x456>();
    set_caller_address(voter);

    // Give voter voting power
    GovernanceToken::delegate(voter);

    Governor::cast_vote(proposal_id, true);

    let proposal = Governor::proposals(proposal_id);
    assert(proposal.for_votes > u256 { low: 0, high: 0 }, 'no votes');
}
```

## Step 6: Deployment

```bash
# 1. Deploy governance token
sncast deploy --class-hash <TOKEN_CLASS_HASH> \
  --constructor-calldata "GovernanceToken" "GOV" 1000000 0x123 0x123 \
  --account my_account

# 2. Deploy timelock
sncast deploy --class-hash <TIMELOCK_CLASS_HASH> \
  --constructor-calldata 86400 0x123 \
  --account my_account

# 3. Deploy governor
sncast deploy --class-hash <GOVERNOR_CLASS_HASH> \
  --constructor-calldata <TOKEN_ADDR> <TIMELOCK_ADDR> 7200 432000 1000 5000 0x123 \
  --account my_account
```

## Step 7: Frontend Integration

```typescript
import { Account, Contract, json, uint256 } from "starknet";

const GOVERNOR_ABI = json.parse([
  "function propose(target: ContractAddress, calldata: felt252[], description: felt252) -> u256",
  "function cast_vote(proposal_id: u256, support: bool)",
  "function execute(proposal_id: u256)",
  "function cancel(proposal_id: u256)",
  "function state(proposal_id: u256) -> u8",
  "function proposal_threshold() -> u256",
  "function quorum() -> u256",
  "function voting_period() -> u64",
  "event ProposalCreated(proposal_id: u256, proposer: ContractAddress)",
  "event VoteCast(voter: ContractAddress, proposal_id: u256, support: bool, votes: u256)",
  "event ProposalExecuted(proposal_id: u256)",
]);

const governorAddress = "0x...";
const governor = new Contract(GOVERNOR_ABI, governorAddress, account);

// Create proposal
const proposalId = await governor.propose(
  targetContractAddress,
  [selector, ...calldata],
  description,
);

// Cast vote
await governor.cast_vote(proposalId, true); // true = for, false = against

// Check proposal state
const state = await governor.state(proposalId);
const stateNames = [
  "Pending",
  "Active",
  "Canceled",
  "Defeated",
  "Succeeded",
  "Executed",
];
console.log("State:", stateNames[state]);

// Execute proposal
await governor.execute(proposalId);

// Get proposal details
const threshold = await governor.proposal_threshold();
const quorum = await governor.quorum();
```

## Tips Keamanan

1. **Quorum**: Pastikan quorum cukup tinggi untuk validitas proposal
2. **Voting delay**: Beri waktu yang cukup sebelum voting dimulai
3. **Timelock**: Delay wajib untuk eksekusi proposal
4. **Access control**: Batasiwho can propose dan execute
5. **Double voting**: Cegah voter memberikan suara dua kali

## Referensi

- [OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/4.x/governance)
- [Governor Contract](https://github.com/OpenZeppelin/cairo-contracts/blob/main/src/governance/governor.cairo)
- [Timelock Controller](https://github.com/OpenZeppelin/cairo-contracts/blob/main/src/governance/timelock.cairo)
- [starknet.js](https://www.starknet-react.com/)
