# Merkle Membership Proof

## Overview

Contoh penggunaan Merkle tree untuk membership verification dalam ZK circuits.

## Circuit

```noir
/// @title Merkle Membership Proof
/// @notice Verifies membership in Merkle tree
/// @param root The Merkle root (public)
/// @param leaf The leaf value (private)
/// @param path The proof path (private)
/// @param indices Left/right indicators (private)
fn main(
    // Public
    root: Field,

    // Private
    leaf: Field,
    path: [Field; 32],
    indices: [bool; 32]
) {
    // Compute root from path
    let computed_root = merkle_tree::compute_root_from_path(
        leaf,
        path,
        indices
    );

    // Verify membership
    constrain root == computed_root;
}
```

## Usage

```bash
# Create proof
nargo execute --prover-inputs leaf=123 path=[...] indices=[...]

# Verify
nargo verify
```

## Security Considerations

- Verify tree depth matches expected
- Check indices are valid (only 0 or 1)
- Ensure path length is correct
