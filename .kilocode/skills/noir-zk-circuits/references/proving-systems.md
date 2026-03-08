# Proving Systems

## Overview

Noir supports multiple proving systems:

### UltraPlonk (Default for Aztec)

- Fast proving time
- Large proof size
- Native to Aztec Network

### Plonk

- Medium proving time
- Medium proof size
- Universal setup

### Groth16

- Fast proving time
- Small proof size
- Circuit-specific setup

## Nargo Commands

```bash
# Initialize project
nargo init my_circuit

# Compile circuit
nargo compile

# Execute (generate witness)
nargo execute

# Generate proof
nargo prove

# Verify proof
nargo verify

# Run tests
nargo test
```

## Proving Flow

1. **Write Circuit** - Define constraints in Noir
2. **Compile** - `nargo compile` generates circuit.json
3. **Execute** - `nargo execute` generates witness
4. **Prove** - Generate proof using backend
5. **Verify** - Verify proof against public inputs

## Backend Integration

### Barretenberg (Default)

```bash
bb prove -b target/circuit.json -w target/witness.gz
bb verify -b target/circuit.json -p target/proof
```

### Solidity Verifier

```bash
bb write_solidity_verifier -k target/vk -o verifier.sol
```
