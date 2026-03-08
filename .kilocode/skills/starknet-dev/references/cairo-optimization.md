# Cairo Optimization

Referensi untuk optimasi performa kontrak Cairo — fixing slow loops, expensive arithmetic, integer splitting atau limb assembly, modular reduction, storage slot packing, atau BoundedInt type bounds.

## Kapan Menggunakan

- Optimasi performa kontrak setelah implementasi dan tests lulus
- Memperbaiki loop yang lambat
- Mengoptimalkan arithmetic yang mahal
- Storage slot packing
- Menggunakan BoundedInt type bounds

**Bukan untuk:** Penulisan kontrak (gunakan cairo-contracts), testing (gunakan cairo-testing), deployment (gunakan cairo-deploy)

## Prinsip Dasar

1. **Minimize storage reads/writes** — batch operations
2. **Use appropriate types** — felt252 lebih murah dari u256
3. **Avoid unnecessary computations** — cache values
4. **Use BoundedInt** untuk type safety dengan range yang diketahui

## BoundedInt Patterns

```cairo
use alexandria_numeric::biguint::{BigInt, BigIntTrait};

// Use BoundedInt untuk memastikan nilai dalam range yang valid
type BoundedU256 = BoundedInt::<0, 1000000>::BoundedInt;
```

## Storage Optimization

```cairo
// Pack multiple values into single storage slot
#[storage]
struct Storage {
    // Pack: flag (1 bit) + value (31 bits) = 32 bits
    packed_data: u32,
}

fn pack(flag: bool, value: u31) -> u32 {
    (if flag { 1 } else { 0 }) | (value.into() << 1)
}

fn unpack(packed: u32) -> (bool, u31) {
    let flag = packed & 1 == 1;
    let value = (packed >> 1).try_into().unwrap();
    (flag, value)
}
```

## Loop Optimization

```cairo
// Bad: multiple storage reads in loop
fn sum_bad(ref self: ContractState) -> u256 {
    let mut total = 0;
    let mut i = 0;
    loop {
        if i >= 10 { break; }
        total += self.values.read(i);  // reads each iteration
        i += 1;
    };
    total
}

// Good: cache values
fn sum_good(ref self: ContractState) -> u256 {
    let mut total = 0;
    let mut i = 0;
    let mut values = ArrayTrait::new();
    // Read all first
    loop {
        if i >= 10 { break; }
        values.append(self.values.read(i));
        i += 1;
    };
    // Then sum
    i = 0;
    loop {
        if i >= 10 { break; }
        total += *values.at(i);
        i += 1;
    };
    total
}
```

## Arithmetic Optimization

```cairo
// Use addition instead of multiplication when possible
fn double(x: u256) -> u256 {
    x + x  // cheaper than x * 2
}

// Use checked functions to avoidpanics
use starknet:: SignedInto;
let result = a - b;  // may panic
let result = a - b;  // checked version
```

## Referensi

- [Cairo Book - Optimization](https://book.cairo-lang.org/)
- [Starknet Performance Guide](https://docs.starknet.io/)
