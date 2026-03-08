# Simple Proof Example

## Overview

Contoh sederhana ZK proof yang membuktikan knowledge of a number without revealing it.

## Circuit Code

```noir
/// @title Simple Knowledge Proof
/// @notice Proves knowledge of a secret number
/// @param hash The hash of the secret (public)
/// @param secret The secret number (private)
fn main(
    hash: Field,        // Public input
    secret: Field,      // Private input
) {
    // Constraint: secret must be positive
    constrain secret > 0;

    // For this simple example, we use identity
    // In production, use pedersen_hash or poseidon
    let computed_hash = secret;

    // Prove knowledge
    constrain hash == computed_hash;
}
```

## Usage

```bash
# Compile
nargo compile

# Generate witness
nargo execute --prover-inputs secret=42

# Generate proof
nargo prove

# Verify
nargo verify
```
