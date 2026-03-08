# Noir Syntax Reference

## Tipe Data Dasar

### Field

```noir
let field_element: Field = 123;  // 254-bit integer
```

### Integer Types

```noir
let integer: u32 = 42;           // Unsigned 32-bit
let small: u8 = 255;             // Unsigned 8-bit
```

### Boolean

```noir
let flag: bool = true;
```

### Arrays

```noir
let array: [Field; 3] = [1, 2, 3];
```

### Strings

```noir
let string: str<5> = "hello";
```

## Variables

```noir
// Immutable (default)
let value: Field = 42;

// Mutable
let mut counter: u32 = 0;
counter = counter + 1;

// Constant
global MAX_VALUE: Field = 100;
```

## Functions

```noir
fn add(a: Field, b: Field) -> Field {
    a + b
}

// Private function (internal)
fn internal_helper() -> bool {
    true
}

// Main function (entry point)
fn main(public_input: Field, private_input: Field) {
    constrain public_input == private_input * 2;
}
```

## Control Flow

```noir
// If-else expression
let result = if condition {
    value_a
} else {
    value_b
};

// For loop (deterministic)
for i in 0..10 {
    // Circuit logic
}
```

## Constraints

```noir
// Equality constraint
constrain a == b;

// Expression constraint
constrain x * y == z;

// Range constraint
constrain value < 100;

// Boolean constraint
constrain flag == true || flag == false;
```

## Modules

```noir
mod utils {
    fn helper() -> Field { 42 }
}

use crate::utils::helper;
```
