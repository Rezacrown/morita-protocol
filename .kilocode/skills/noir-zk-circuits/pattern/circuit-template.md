# Circuit Template

## Basic Structure

```noir
/// @title [Title]
/// @notice [Description]
/// @dev [Additional notes]
/// @param [param_name] [Description]
fn main(
    // Public inputs
    public_input: Field,

    // Private inputs
    private_input: Field,
) {
    // 1. Input validation
    constrain private_input > 0;

    // 2. Compute values

    // 3. Constraints
    constrain public_input == computed_value;
}
```

## Full Example

```noir
mod example {
    /// @title Simple Proof
    /// @notice Proves knowledge of a preimage
    fn main(
        hash: Field,          // Public: expected hash
        preimage: Field,      // Private: the preimage
    ) {
        // Validate input
        constrain preimage > 0;

        // Compute hash (simplified)
        let computed_hash = preimage;

        // Constraint
        constrain hash == computed_hash;
    }
}
```
