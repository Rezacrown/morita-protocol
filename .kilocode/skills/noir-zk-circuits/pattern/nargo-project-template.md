# Nargo Project Template

## Project Structure

```
my_zk_app/
├── Nargo.toml           # Project manifest
├── Prover.toml          # Prover inputs
├── Verifier.toml        # Verifier inputs
└── src/
    └── main.nr          # Main circuit
```

## Nargo.toml

```toml
[package]
name = "my_circuit"
type = "bin"
authors = ["your_name"]
compiler_version = "0.1.0"

[dependencies]
noir_stdlib = { tag = "v0.1.0", git = "https://github.com/noir-lang/noir-stdlib" }
```

## Prover.toml

```toml
public_input = "123"
private_input = "456"
```

## Verifier.toml

```toml
public_input = "123"
```

## Commands

```bash
# Initialize
nargo init my_circuit

# Compile
nargo compile

# Test
nargo test

# Prove
nargo prove

# Verify
nargo verify
```
