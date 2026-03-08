# Cairo Testing

Referensi untuk testing smart contract Cairo dengan Starknet Foundry (snforge).

## Kapan Menggunakan

- Menulis unit tests untuk fungsi kontrak Cairo
- Menulis integration tests yang men-deploy dan berinteraksi dengan kontrak
- Menggunakan cheatcodes untuk memanipulasi block state, caller, timestamps
- Menguji events yang di-emit dengan benar
- Fuzzing input kontrak
- Fork-testing terhadap state Starknet live

**Bukan untuk:** Struktur kontrak (gunakan cairo-contracts), optimisasi (gunakan cairo-optimization), deployment (gunakan cairo-deploy)

## Setup

### Scarb.toml

```toml
[dev-dependencies]
snforge_std = "0.56.0"

[[target.starknet-contract]]
sierra = true
casm = true
```

### Menjalankan Tests

```bash
# Run all tests
snforge test

# Run specific test by name
snforge test test_transfer

# Run with gas reporting
snforge test --detailed-resources
```

## Basic Test Structure

```cairo
#[cfg(test)]
mod tests {
    use super::MyContract;
    use starknet::ContractAddress;
    use starknet::contract_address_const;

    fn OWNER() -> ContractAddress {
        contract_address_const::<'OWNER'>()
    }

    #[test]
    fn test_constructor() {
        let mut state = MyContract::contract_state_for_testing();
        MyContract::constructor(ref state, OWNER());
        assert(state.get_owner() == OWNER(), 'wrong owner');
    }
}
```

## Contract Deployment in Tests

```cairo
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};

fn deploy_contract() -> ContractAddress {
    let contract = declare("MyContract").unwrap().contract_class();
    let constructor_calldata = array![OWNER().into()];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}
```

## Cheatcodes

### Caller Address

```cairo
use snforge_std::{start_cheat_caller_address, stop_cheat_caller_address};

#[test]
fn test_only_owner() {
    let contract_address = deploy_contract();
    let dispatcher = IMyContractDispatcher { contract_address };

    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.owner_only_function();
    stop_cheat_caller_address(contract_address);
}
```

### Block Timestamp

```cairo
use snforge_std::{start_cheat_block_timestamp, stop_cheat_block_timestamp};

start_cheat_block_timestamp(contract_address, 1000000);
```

## Expected Failures

```cairo
#[test]
#[should_panic(expected: 'Caller is not the owner')]
fn test_unauthorized_access() {
    let contract_address = deploy_contract();
    let dispatcher = IMyContractDispatcher { contract_address };

    start_cheat_caller_address(contract_address, USER());
    dispatcher.owner_only_function();
}
```

## Event Testing

```cairo
use snforge_std::{spy_events, EventSpyAssertionsTrait, EventSpyTrait};

#[test]
fn test_transfer_emits_event() {
    let contract_address = deploy_contract();
    let dispatcher = IMyContractDispatcher { contract_address };

    let mut spy = spy_events();
    start_cheat_caller_address(contract_address, OWNER());
    dispatcher.transfer(USER(), 100);

    spy.assert_emitted(@array![
        (
            contract_address,
            MyContract::Event::Transfer(
                MyContract::Transfer {
                    from: OWNER(),
                    to: USER(),
                    amount: 100,
                }
            )
        )
    ]);
}
```

## Fuzzing

```cairo
#[test]
#[fuzzer(runs: 256, seed: 12345)]
fn test_deposit_any_amount(amount: u256) {
    let contract_address = deploy_contract();
    let dispatcher = IMyContractDispatcher { contract_address };

    start_cheat_caller_address(contract_address, USER());
    dispatcher.deposit(amount);

    assert(dispatcher.get_balance(USER()) == amount, 'balance mismatch');
}
```

## Fork Testing

```cairo
use snforge_std::BlockTag;

#[test]
#[fork(url: "https://starknet-mainnet.g.alchemy.com/v2/YOUR_KEY", block_tag: latest)]
fn test_against_mainnet() {
    let usdc_address = contract_address_const::<0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8>();
    let dispatcher = IERC20Dispatcher { contract_address: usdc_address };

    let supply = dispatcher.total_supply();
    assert(supply > 0, 'USDC should have supply');
}
```

## Referensi

- [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/)
- [snforge Std](https://scarbs.dev/packages/snforge_std)
