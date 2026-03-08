# Template Testing dengan Snforge

Template ini menyediakan struktur testing dasar untuk kontrak Cairo menggunakan snforge testing framework.

## 1. Setup Snforge

### Install

```bash
# Via scarb
scarb plugin install snforge-sncast --version 2.0.0

# Install snforge binary
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/install.sh | sh
```

### Konfigurasi Scarb.toml

```toml
[tool.snforge]
profile = "release"

[[test]]
name = "my_contract_test"
filter = "test_"
```

## 2. Basic Test Structure

### File Test Pertama

```cairo
#[cfg(test)]
mod tests {
    use starknet::ContractAddress;
    use starknet::testing::set_caller_address;
    use my_contract::MyContract;

    // Deploy kontrak untuk testing
    fn deploy_contract() -> (ContractAddress, IMyContractDispatcher) {
        let owner = starknet::contract_address_const::<0x123>();

        // Deploy dengan constructor
        let mut calldata = array![owner.into()];
        let (address, _) = starknet::deploy_syscall(
            MyContract::TEST_CLASS_HASH.try_into().unwrap(),
            calldata.span(),
            false
        ).expect('Deploy failed');

        (address, IMyContractDispatcher { contract_address: address })
    }

    #[test]
    fn test_initial_value() {
        let (_, dispatcher) = deploy_contract();

        let value = dispatcher.get_value();
        assert(value == 0, 'Initial value should be 0');
    }

    #[test]
    fn test_set_value() {
        let (owner, dispatcher) = deploy_contract();

        // Set caller ke owner
        set_caller_address(owner);

        // Call function
        dispatcher.set_value(100);

        // Verify
        let value = dispatcher.get_value();
        assert(value == 100, 'Value should be 100');
    }

    #[test]
    #[should_panic(expected: ('Only owner can set value',))]
    fn test_only_owner_can_set() {
        let (_, dispatcher) = deploy_contract();
        let not_owner = starknet::contract_address_const::<0x456>();

        set_caller_address(not_owner);

        // Should panic
        dispatcher.set_value(100);
    }
}
```

## 3. Cheatcodes Usage

### set_caller_address

```cairo
use starknet::testing::set_caller_address;

#[test]
fn test_with_specific_caller() {
    let specific_caller = starknet::contract_address_const::<0x789>();
    set_caller_address(specific_caller);

    // Contract akan melihat specific_caller sebagai caller
}
```

### set_contract_address

```cairo
use starknet::testing::set_contract_address;

#[test]
fn test_self_call() {
    let self_address = starknet::contract_address_const::<0x111>();
    set_contract_address(self_address);

    // Contract akan melihat dirinya sendiri
}
```

### set_block_number / set_block_timestamp

```cairo
use starknet::testing::set_block_number;
use starknet::testing::set_block_timestamp;

#[test]
fn test_time_dependent() {
    set_block_number(100);
    set_block_timestamp(1700000000);

    // Test logic yang bergantung pada waktu
}
```

### Warp (Set Block Timestamp Future)

```cairo
use starknet::testing::warp;

#[test]
fn test_future_timestamp() {
    // Warp ke 1 jam dari sekarang
    warp(1700000000 + 3600).unwrap();
}
```

### Prank (Multiple Cheats)

```cairo
use starknet::testing::prank;
use starknet::testing::stop_prank;

#[test]
fn test_prank_caller() {
    let caller = starknet::contract_address_const::<0x123>();

    // Prank caller - set caller untuk call berikutnya
    prank(caller).unwrap();

    // Execute call
    // ...

    // Stop prank
    stop_prank().unwrap();
}
```

### Store and Load

```cairo
use starknet::testing::store;
use starknet::class_hash::ClassHash;

#[test]
fn test_storage_manipulation() {
    let key = selector!("my_value");
    let value: u256 = 12345;

    // Write ke storage
    store(
        contract_address,
        key,
        array![value.low, value.high].span()
    );
}
```

## 4. Advanced Testing Patterns

### Testing Events

```cairo
use starknet::testing::pop_log;

#[test]
fn test_event_emitted() {
    let (owner, dispatcher) = deploy_contract();
    set_caller_address(owner);

    dispatcher.set_value(100);

    // Pop event from logs
    let event = pop_log::<ValueChanged>(contract_address).unwrap();

    assert(event.old_value == 0, 'Old value incorrect');
    assert(event.new_value == 100, 'New value incorrect');
}
```

### Testing ERC20

```cairo
use openzeppelin::token::erc20::ERC20;

#[test]
fn test_erc20_transfer() {
    // Deploy ERC20
    let (erc20, _) = deploy_erc20();

    // Check balance
    let balance = erc20.balance_of(owner);
    assert(balance == initial_supply, 'Balance incorrect');

    // Transfer
    erc20.transfer(recipient, 100);

    // Verify
    assert(erc20.balance_of(recipient) == 100, 'Transfer failed');
}
```

### Testing Reverts

```cairo
#[test]
#[should_panic(expected: ('Insufficient balance',))]
fn test_transfer_fails() {
    // Should panic dengan message yang diharapkan
    erc20.transfer(recipient, 1000000);
}
```

## 5. Running Tests

```bash
# Run all tests
snforge test

# Run specific test
snforge test test_set_value

# Run with print output
snforge test --print

# Run with coverage
snforge test --coverage
```

## 6. Test Organization

```
src/
├── contract.cairo
└── tests/
    ├── test_contract.cairo
    ├── test_erc20.cairo
    └── test_integration.cairo
```

### Scarb.toml configuration

```toml
[[test]]
name = "test_contract"
filter = "test_"

[[test]]
name = "test_erc20"
filter = "test_"
```

## 7. Best Practices

1. **Isolasi test** - Setiap test harus deploy kontrak fresh
2. **Gunakan helper functions** - Extract deployment logic
3. **Test edge cases** - Include boundary conditions
4. **Test events** - Verify state changes emit events correctly
5. **Test reverts** - Ensure error messages match expectations
6. **Coverage** - Aim for high test coverage
