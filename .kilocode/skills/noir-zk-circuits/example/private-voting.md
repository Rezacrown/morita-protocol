# Private Voting Example

## Overview

Sistem voting privat menggunakan ZK proofs. Voter bisa vote tanpa reveal identity atau pilihan.

## Circuit

```noir
/// @title Private Voting Circuit
/// @notice Verifies valid vote without revealing choice
/// @dev Uses merkle proof for voter eligibility
fn main(
    // Public inputs
    merkle_root: Field,        // Merkle root of eligible voters
    vote_commitment: Field,   // Commitment to vote
    nullifier: Field,         // Unique nullifier

    // Private inputs
    voter_secret: Field,       // Voter's secret
    vote_choice: Field,        // 0 or 1
    randomness: Field,         // Randomness for commitment
    merkle_path: [Field; 20], // Merkle proof
    indices: [bool; 20]        // Path indices
) {
    // 1. Verify merkle membership
    let computed_root = merkle::verify(merkle_path, indices, voter_secret);
    constrain computed_root == merkle_root;

    // 2. Create vote commitment
    let computed_commitment = pedersen_hash([vote_choice, randomness]);
    constrain computed_commitment == vote_commitment;

    // 3. Create nullifier
    let computed_nullifier = pedersen_hash([voter_secret]);
    constrain computed_nullifier == nullifier;
}
```

## Key Concepts

1. **Merkle Proof** - Verify voter is eligible without revealing identity
2. **Commitment** - Hide vote choice using pedersen hash
3. **Nullifier** - Prevent double-voting
