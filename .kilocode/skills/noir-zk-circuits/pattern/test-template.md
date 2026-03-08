# Test Template

## Unit Test

```noir
#[test]
fn test_addition() {
    let result = add(2, 3);
    assert(result == 5);
}
```

## Failing Test

```noir
#[test(should_fail)]
fn test_will_fail() {
    assert(false);
}
```

## Test with Error Message

```noir
#[test(should_fail_with = "error message")]
fn test_error_message() {
    require(false, "error message");
}
```

## Integration Test

```noir
#[test]
fn test_proof_generation() {
    // 1. Setup inputs
    let public_input: Field = 42;
    let private_input: Field = 21;

    // 2. Execute circuit
    // Note: Full proof generation requires backend

    // 3. Assert result
    assert(public_input == private_input * 2);
}
```
