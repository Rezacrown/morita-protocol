# Noir Standard Library

## Cryptographic Primitives

### Pedersen Hash

```noir
use dep::std::hash::pedersen;
let hash = pedersen_hash(input);
```

### Poseidon Hash

```noir
use dep::std::hash::poseidon;
let hash = poseidon_hash(input);
```

### Merkle Tree

```noir
use dep::std::merkle_tree;
let root = merkle_tree::compute_root(leaves);
let valid = merkle_tree::verify_membership(root, leaf, path);
```

### Schnorr Signatures

```noir
use dep::std::schnorr;
let valid = schnorr::verify_signature(public_key, message, signature);
```

### Elliptic Curve Operations

```noir
use dep::std::ec;
let point = ec::add(point_a, point_b);
```

## Built-in Functions

### Arithmetic

```noir
fn add(a: Field, b: Field) -> Field { a + b }
fn mul(a: Field, b: Field) -> Field { a * b }
fn div(a: Field, b: Field) -> Field { a / b }
```

### Comparison

```noir
fn eq(a: Field, b: Field) -> bool { a == b }
fn lt(a: Field, b: Field) -> bool { a < b }
```

### Array Operations

```noir
fn len<T>(array: [T]) -> Field
fn push<T>(array: [T], element: T) -> [T]
```

## Field Operations

```noir
let sum: Field = a + b;
let product: Field = a * b;
let inverse: Field = a.inverse();
let negated: Field = -a;
let mod_result = a % modulus;
```
