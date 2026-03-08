---
name: noir-zk-circuits
description: Skill untuk membangun ZK circuits dengan Noir Language - Aztec Network, proving systems, dan on-chain verification
---

# Instructions

Skill ini digunakan untuk membuat Zero Knowledge circuits dengan Noir Language. Gunakan skill ini ketika:

1. **Membuat ZK proofs** - Private transactions, identity proofs
2. **Mengembangkan di Aztec Network** - Private smart contracts
3. **On-chain verification** - Verify proofs di Ethereum

## Mandatory Questions

Sebelum mulai, tanyakan ke user:

### 1. Use Case

- Private voting?
- Private token transfer?
- Identity verification?
- Custom circuit?

### 2. Platform Target

- Aztec Network?
- Ethereum (on-chain verifier)?
- Standalone?

### 3. Proving System

- UltraPlonk (default)?
- Plonk?
- Groth16?

### 4. Testing Level

- Unit tests only?
- Integration with Aztec Sandbox?
- End-to-end proof generation?

## Code Ordering (Struktur Circuit)

Ikuti urutan berikut untuk Noir circuits:

```noir
// 1. Module imports (use statements)
// 2. Type definitions / Structs
// 3. Constants (global)
// 4. Private input definitions
// 5. Public input definitions
// 6. Helper/utility functions
// 7. Main constraint functions
// 8. Main entry point
```

## Comment Conventions

Gunakan format Solidity/NATSPEc untuk dokumentasi:

```noir
/// @title Private Voting Circuit
/// @notice Verifies that a vote is valid without revealing the choice
/// @dev Uses pedersen hash for commitment and merkle proof for membership
/// @param voter_commitment The pedersen hash of voter's identity
/// @param vote_commitment The encrypted vote commitment
fn main(
    voter_commitment: Field,    // Private: Identity commitment
    merkle_root: Field,         // Public: Merkle tree root
    // ... inputs
) {
    // Implementation...
}
```

## Security Checklist

Setiap circuit harus memenuhi:

- [ ] All variables constrained
- [ ] No underconstrained values
- [ ] Input validation complete
- [ ] Range checks for all numeric values
- [ ] No integer overflow (use Field arithmetic)
- [ ] Merkle proof depth verified
- [ ] Nullifier uniqueness guaranteed

## Common Errors

| Error                      | Cause               | Solution                 |
| -------------------------- | ------------------- | ------------------------ |
| `constraint not satisfied` | Wrong input values  | Verify inputs match      |
| `underconstrained`         | Missing constraints | Add constrain statements |
| `index out of bounds`      | Array access error  | Check array length       |
| `type mismatch`            | Wrong type used     | Cast to correct type     |

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│            ZK Application               │
├─────────────────────────────────────────┤
│  Prover                                  │
│  ┌─────────────────────────────────┐    │
│  │   Circuit (Noir)                │    │
│  │   ├── Private Inputs            │    │
│  │   ├── Public Inputs             │    │
│  │   └── Constraints               │    │
│  └─────────────────────────────────┘    │
│              ↓                          │
│  ┌─────────────────────────────────┐    │
│  │   Proof Generation (Barretenberg)│   │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Verifier (On-chain/Ethereum)           │
└─────────────────────────────────────────┘
```

## References

- [Noir Syntax](references/noir-syntax.md)
- [Noir Standard Library](references/noir-stdlib.md)
- [Proving Systems](references/proving-systems.md)
- [Security Best Practices](references/security-best-practices.md)

## Examples

- [Simple Proof](example/simple-proof.md)
- [Private Voting](example/private-voting.md)
- [Merkle Membership](example/merkle-membership.md)

## Patterns

- [Circuit Template](pattern/circuit-template.md)
- [Test Template](pattern/test-template.md)
- [Nargo Project Template](pattern/nargo-project-template.md)
