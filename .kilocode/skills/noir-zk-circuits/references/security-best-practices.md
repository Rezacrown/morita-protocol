# Security Best Practices

## Common Vulnerabilities

### 1. Underconstrained Circuits

Masalah: Variables yang tidak di-constrain bisa memiliki nilai sembarang.

```noir
// BAD: x tidak di-constrain
let x: Field = input;

// GOOD: x di-constrain ke nilai yang valid
let x: Field = input;
constrain x < MAX_VALUE;
```

### 2. Missing Input Validation

Selalu validasi input:

```noir
fn main(amount: Field) {
    // Always validate range
    constrain amount > 0;
    constrain amount < MAX_AMOUNT;
}
```

### 3. Integer Overflow

Gunakan Field arithmetic:

```noir
// Use Field operations for safety
let sum = a + b;  // No overflow in Field
```

## Security Checklist

- [ ] All variables constrained
- [ ] No underconstrained values
- [ ] Input validation complete
- [ ] Range checks for all numeric values
- [ ] No integer overflow
- [ ] Merkle proof depth verified
- [ ] Nullifier uniqueness guaranteed

## Audit Tips

1. **Constraint Coverage** - Pastikan semua paths di-constrain
2. **Edge Cases** - Test boundary conditions
3. **Determinism** - Circuit harus deterministic
4. **No Secret Dependencies** - Jangan hardcode secrets
