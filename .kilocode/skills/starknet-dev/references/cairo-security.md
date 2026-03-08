# Cairo Security

Referensi untuk mereview kontrak Cairo untuk security — common vulnerabilities, audit patterns, production hardening, Cairo-specific pitfalls, L1/L2 bridging safety, session key security, precision/rounding bugs, static analysis tooling.

## Kapan Menggunakan

- Security review kontrak Cairo
- Audit smart contracts
- Implementasi production hardening
- Identifikasi Cairo-specific pitfalls
- Keamanan L1/L2 bridging
- Session key security
- Precision/rounding bugs

**Bukan untuk:** Penulisan kontrak (gunakan cairo-contracts), testing (gunakan cairo-testing), deployment (gunakan cairo-deploy)

## Common Vulnerabilities

### Reentrancy

```cairo
#[storage]
struct Storage {
    entered: bool,
}

fn _enter(ref self: ContractState) {
    assert(!self.entered.read(), 'ReentrancyGuard: reentrant');
    self.entered.write(true);
}

fn _exit(ref self: ContractState) {
    self.entered.write(false);
}
```

### Access Control

```cairo
use openzeppelin_access::ownable::OwnableComponent;

component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

fn protected_function(ref self: ContractState) {
    self.ownable.assert_only_owner();
    // function logic
}
```

### Integer Overflow

```cairo
use starknet::OverflowAdd;

// Use checked arithmetic
let result = a.try_add(b);  // returns Option<u256>
```

## Audit Checklist

1. **Access Control**
   - [ ] Semua fungsi yang memerlukan authorization memiliki checks
   - [ ] Role-based access sudah diimplementasikan dengan benar

2. **Input Validation**
   - [ ] Semua input divalidasi
   - [ ] Zero address checks
   - [ ] Range checks untuk numeric values

3. **Reentrancy Protection**
   - [ ] Reentrancy guard untuk fungsi yang melakukan external calls
   - [ ] Update state sebelum transfer

4. **Oracle Manipulation**
   - [ ] Price feeds menggunakan TWAP atau oracle yang aman
   - [ ] Validation untuk oracle data

5. **L1/L2 Bridging**
   - [ ] Message handling yang aman
   - [ ] Merkle proof verification
   - [ ] Deadline/expiry untuk pending messages

## Production Hardening

```cairo
// Constructor validation
#[constructor]
fn constructor(ref self: ContractState, owner: ContractAddress) {
    assert(!owner.is_zero(), 'Owner cannot be zero');
    self.ownable.initializer(owner);
}

// Pausable for emergencies
use openzeppelin_security::pausable::PausableComponent;

component!(path: PausableComponent, storage: pausable, event: PausableEvent);

fn critical_function(ref self: ContractState) {
    self.pausable.assert_not_paused();
    // function logic
}
```

## Static Analysis

```bash
# Run static analysis
scarb analyze

# Use tooling
# - slither-equivalent untuk Cairo
# - starknet-analyzer
```

## Referensi

- [Cairo Book - Security](https://book.cairo-lang.org/)
- [Starknet Security Best Practices](https://docs.starknet.io/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/)
