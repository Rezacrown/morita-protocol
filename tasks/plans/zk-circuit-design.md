# Morita Protocol ZK Circuit Design - Invoice System

**Version:** 1.0  
**Date:** March 2026  
**Author:** Architecture Design  
**Status:** Draft for Review

---

## Daftar Isi

1. [Executive Summary](#executive-summary)
2. [Requirements Analysis](#requirements-analysis)
3. [Circuit Architecture](#circuit-architecture)
4. [Input/Output Definitions](#inputoutput-definitions)
5. [Circuit Constraints](#circuit-constraints)
6. [Noir Circuit Implementation](#noir-circuit-implementation)
7. [Security Considerations](#security-considerations)
8. [Frontend Integration](#frontend-integration)
9. [Smart Contract Integration](#smart-contract-integration)

---

## Executive Summary

Dokumen ini mendefinisikan desain ZK (Zero-Knowledge) circuit untuk **Morita Protocol**, sebuah sistem invoice dengan privacy features yang dibangun di atas Starknet. Circuit ini menggunakan **Noir language** dengan backend **UltraHonk** dan integrasi **Garaga** untuk verifikasi di Starknet.

### Current State (Tidak Adequate!)

```noir
fn main(x: Field, y: pub Field) { assert(x != y); }
```

Circuit di atas hanya membuktikan `x != y`, yang **TIDAK memadai** untuk use case invoice.

### Target Circuit

Circuit yang proper harus bisa membuktikan:

- Invoice data valid (amount, addresses)
- Private data (client name, description) di-hash dengan benar
- Committed hash match dengan on-chain storage
- Client address binding (hanya client tertentu yang bisa bayar)

---

## Requirements Analysis

### 1. Functional Requirements

| Requirement | Description                                                      | Privacy Level |
| ----------- | ---------------------------------------------------------------- | ------------- |
| **R1**      | Freelancer address valid (format, non-zero)                      | Public        |
| **R2**      | Client address valid (format, non-zero, berbeda dari freelancer) | Public        |
| **R3**      | Amount > 0 (valid payment)                                       | Public        |
| **R4**      | Encryption key provided (untuk reveal later)                     | Private       |
| **R5**      | Client name hashed (committed, not revealed)                     | Private       |
| **R6**      | Description hashed (committed, not revealed)                     | Private       |
| **R7**      | Private hashes must match commitment di on-chain                 | Verification  |
| **R8**      | Merkle tree proof (optional) untuk address verification          | Optional      |

### 2. Privacy Matrix

| Data                      | On-Chain | Client-Side | Freelancer-Only |
| ------------------------- | -------- | ----------- | --------------- |
| Invoice Hash (commitment) | ✅ Ya    | -           | -               |
| Amount (STRK)             | ✅ Ya    | ✅ Ya       | -               |
| Freelancer Address        | ✅ Ya    | ✅ Ya       | -               |
| Client Address            | ✅ Ya    | ✅ Ya       | -               |
| **Client Name**           | ❌ Tidak | ✅ Ya       | ✅ Ya           |
| **Description**           | ❌ Tidak | ✅ Ya       | ✅ Ya           |
| **Encryption Key**        | ❌ Tidak | ✅ Ya       | ✅ Ya           |
| ZK Proof                  | ✅ Ya    | -           | -               |

### 3. Security Goals

1. **Non-repudiation**: Freelancer tidak bisa deny invoice dibuat
2. **Binding**: Invoice hanya bisa dibayar client tertentu
3. **Verified ownership**: Client bisa verify invoice dibuat untuk dirinya
4. **Prevention of fraud**: Attacker tidak bisa redirect payment

---

## Circuit Architecture

### High-Level Flow

```mermaid
flowchart TB
    subgraph Freelancer Side
        A[Invoice Data] --> B[Hash Private Data]
        A --> C[Hash Addresses]
        B --> D[Compute Commitment]
        C --> D
        D --> E[Generate ZK Proof]
    end

    subgraph Circuit
        E --> F[Noir Circuit]
        G[Private Inputs] --> F
        H[Public Inputs] --> F
    end

    subgraph Starknet
        F --> I[Verify Proof]
        I --> J[Store Commitment]
    end

    G Private Inputs: encryption_key, client_name_hash, description_hash, client_address_hash
    H Public Inputs: commitment_hash, amount, freelancer_address, client_address
```

### Privacy-Proof Strategy

```
┌────────────────────────────────────────────────────────────────┐
│                   INVOICE COMMIT-REVEAL FLOW                    │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CREATE STEP:                                                   │
│  ┌─────────────┐                                                │
│  │ Private:    │                                                │
│  │ - encryption_key                                               │
│  │ - client_name_hash                                      │
│  │ - description_hash                                         │
│  └─────────────┘                                                │
│         │                                                       │
│         ▼ Hash dengan Poseidon/Blake2s                         │
│  ┌─────────────┐                                                │
│  │ Commitment: │  H(encryption_key, client_name_hash,          │
│  │ public      │   description_hash, client_address_hash)      │
│  └─────────────┘                                                │
│         │                                                       │
│         ▼ Store di Starknet                                     │
│  ┌─────────────┐                                                │
│  │ On-Chain:   │  commitment_hash                              │
│  │ visible     │  amount, freelancer_address, client_address   │
│  └─────────────┘                                                │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PAY STEP:                                                      │
│  1. Client decrypt URL获取 private data                         │
│  2. Client prove mereka知道 private inputs                      │
│  3. Contract verify commitment matches                         │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## Input/Output Definitions

### Private Inputs (Only known to freelancer/client, never revealed on-chain)

| Parameter             | Type  | Description                      | Validation               |
| --------------------- | ----- | -------------------------------- | ------------------------ |
| `encryption_key`      | Field | 256-bit key untuk AES encryption | Non-zero, 32 bytes       |
| `client_name_hash`    | Field | Hash dari client name            | Valid hash format        |
| `description_hash`    | Field | Hash dari invoice description    | Valid hash format        |
| `client_address_hash` | Field | Hash dari client wallet address  | Consistent dengan public |

### Public Inputs (Revealed on-chain)

| Parameter            | Type      | Description                                 | Validation                       |
| -------------------- | --------- | ------------------------------------------- | -------------------------------- |
| `amount`             | pub Field | Invoice amount dalam wei (u256 format)      | > 0                              |
| `freelancer_address` | pub Field | Freelancer wallet address (Starknet format) | Valid Starknet address, non-zero |
| `client_address`     | pub Field | Client wallet address (Starknet format)     | Valid Starknet address, non-zero |
| `commitment_hash`    | pub Field | Hash dari semua private inputs              | Computation result               |

### Circuit Outputs

| Output     | Type            | Description                                            |
| ---------- | --------------- | ------------------------------------------------------ |
| `verified` | bool (implicit) | Circuit returns void, proof validity indicates success |

---

## Circuit Constraints

### Constraint 1: Address Validation

```noir
// Freelancer address must be valid Starknet address (non-zero, valid format)
let freelancer_valid = freelancer_address != 0;
assert(freelancer_valid);

// Client address must be valid Starknet address (non-zero, valid format)
let client_valid = client_address != 0;
assert(client_valid);

// Client must be different from freelancer
let addresses_different = freelancer_address != client_address;
assert(addresses_different);
```

### Constraint 2: Amount Validation

```noir
// Amount must be greater than 0
let amount_valid = amount > 0;
assert(amount_valid);

// Optional: Maximum amount constraint (prevent overflow abuse)
let max_amount = 10^18; // 1 billion STRK max
let amount_in_range = amount < max_amount;
assert(amount_in_range);
```

### Constraint 3: Commitment Computation

```noir
// Compute Poseidon hash dari private inputs
// Poseidon(encryption_key, client_name_hash, description_hash)
let computed_commitment = poseidon_hash(
    encryption_key,
    client_name_hash,
    description_hash
);

// Verify computed commitment matches public commitment
let commitment_matches = computed_commitment == commitment_hash;
assert(commitment_matches);
```

### Constraint 4: Address Binding (Merkle-style)

```noir
// Optional: Merkle tree proof untuk address verification
// Jika menggunakan merkle tree untuk whitelist

// Verify client address is in allowed Merkle tree
let client_in_whitelist = merkle_verify(
    merkle_root,
    client_address,
    merkle_proof
);
assert(client_in_whitelist);
```

### Constraint 5: Encryption Key Integrity

```noir
// Encryption key must be reasonable (not random garbage)
// Minimal check: key tidak zero dan tidak maximal value
let key_nonzero = encryption_key != 0;
let key_not_max = encryption_key != std::field::MAX_FIELD;
assert(key_nonzero);
assert(key_not_max);
```

---

## Noir Circuit Implementation

### Complete Circuit Code

```noir
// smart-contract/circuit/src/main.nr

// Import dependencies
use std::hash::poseidon_hash;

// ============================================================================
// INVOICE ZK CIRCUIT for Morita Protocol
// =============================================================================
//
// This circuit proves:
// 1. All invoice addresses are valid (freelancer + client)
// 2. Invoice amount is positive
// 3. Creator knows encryption key and hashed private data
// 4. Private data hashes match the committed hash on-chain
// 5. Client address is binding (included in commitment)
// ============================================================================

fn main(
    // Private Inputs
    encryption_key: Field,
    client_name_hash: Field,
    description_hash: Field,
    client_address_hash: Field,

    // Public Inputs
    amount: pub Field,
    freelancer_address: pub Field,
    client_address: pub Field,
    commitment_hash: pub Field
) {
    // ========================================================================
    // CONSTRAINT 1: Validate freelancer address
    // ========================================================================
    // Freelancer address must be non-zero (valid Starknet address)
    assert(freelancer_address != 0, "Freelancer address cannot be zero");

    // ========================================================================
    // CONSTRAINT 2: Validate client address
    // ========================================================================
    // Client address must be non-zero (valid Starknet address)
    assert(client_address != 0, "Client address cannot be zero");

    // ========================================================================
    // CONSTRAINT 3: Ensure parties are different
    // ========================================================================
    // Freelancer cannot create invoice for themselves
    assert(
        freelancer_address != client_address,
        "Freelancer and client must be different addresses"
    );

    // ========================================================================
    // CONSTRAINT 4: Validate invoice amount
    // ========================================================================
    // Amount must be greater than zero
    assert(amount > 0, "Invoice amount must be positive");

    // Optional: Amount upper bound to prevent abuse
    // Max: 100,000,000,000,000,000,000 STRK (100M STRK)
    // let max_amount = 100000000000000000000000000;
    // assert(amount < max_amount, "Amount exceeds maximum allowed");

    // ========================================================================
    // CONSTRAINT 5: Validate encryption key
    // ========================================================================
    // Key must be non-zero
    assert(encryption_key != 0, "Encryption key cannot be zero");

    // Optional: Verify key is from valid random source
    // (minimal validation - full entropy verified off-chain)

    // ========================================================================
    // CONSTRAINT 6: Verify client address commitment
    // ========================================================================
    // Ensure public client_address hashes to the provided client_address_hash
    // This proves the private hash matches the public address
    let computed_client_hash = poseidon_hash(client_address);
    assert(
        computed_client_hash == client_address_hash,
        "Client address hash mismatch"
    );

    // ========================================================================
    // CONSTRAINT 7: Compute and verify final commitment
    // ========================================================================
    // This is the CORE verification:
    // Given all private inputs, compute what the commitment should be
    // and verify it matches the on-chain commitment

    let computed_commitment = poseidon_hash(
        encryption_key,
        client_name_hash,
        description_hash,
        client_address_hash
    );

    assert(
        computed_commitment == commitment_hash,
        "Private data commitment does not match on-chain value"
    );

    // ========================================================================
    // CONSTRAINT 8: Optional - Merkle tree membership (if using whitelist)
    // ========================================================================
    // If we need to verify client is in an allowed list:
    // Uncomment if Merkle tree proof is needed
    //
    // let merkle_root: Field;
    // let merkle_proof: [Field; DEPTH];
    // let (is_valid, _leaf) = merkletree_verify(
    //     merkle_root,
    //     client_address,
    //     merkle_proof
    // );
    // assert(is_valid, "Client not in whitelist");
}
```

### Address Validation Helper

```noir
// smart-contract/circuit/src/address_validation.nr

// Helper function untuk validasi alamat Starknet
fn validate_starknet_address(address: Field) -> Field {
    // Starknet addresses:
    // - Should be less than 2^251
    // - Should be non-zero
    const MAX_STARKNET_ADDRESS = 0x8000000000000100000000000000000000000000000000000000000000000000_field;

    assert(address != 0, "Address cannot be zero");
    assert(address < MAX_STARKNET_ADDRESS, "Address exceeds max value");

    address
}

// Validate two different addresses
fn validate_different_addresses(addr1: Field, addr2: Field) {
    assert(addr1 != addr2, "Addresses must be different");
}
```

### Merkle Tree Verification (Optional)

```noir
// smart-contract/circuit/src/merkle_tree.nr

// Simple Merkle tree verification for address whitelisting
fn merkle_verify(
    merkle_root: Field,
    leaf: Field,
    proof: [Field; 20],  // 20 levels for ~1M addresses
    proof_index: u32
) -> (Field, Field) {
    let mut current = leaf;
    let mut index = proof_index;

    // Note: Noir's current Merkle implementation details
    // This is pseudocode - actual implementation depends on Noir version

    for i in 0..20 {
        let sibling = proof[i];
        if (index % 2) == 0 {
            // Left child
            current = poseidon_hash(current, sibling);
        } else {
            // Right child
            current = poseidon_hash(sibling, current);
        }
        index = index / 2;
    }

    (current == merkle_root, current)
}
```

---

## Security Considerations

### 1. Hash Function Selection

| Hash Function | Pros                                                 | Cons                                        |
| ------------- | ---------------------------------------------------- | ------------------------------------------- |
| **Poseidon**  | ⭐ Recommended - STARK-friendly, built-in untuk Noir | Slightly slower untuk small inputs          |
| Blake2s       | Fast, well-audited                                   | Not STARK-native, requires more constraints |
| Keccak256     | Familiar, widely used                                | Not STARK-native, expensive in circuits     |

**Recommendation: Use Poseidon** - Native to Noir, STARK-friendly, efficient.

### 2. Privacy Guarantees

DENGAN circuit saat ini:

| What is PROVEN                  | What is NOT Proven         |
| ------------------------------- | -------------------------- |
| Freelancer knows encryption key | Actual client name value   |
| Client named dalam invoice      | Description actual content |
| Description exists              | Encryption key value       |
| Commitment matches on-chain     | Client's identity directly |

### 3. Attack Vectors & Mitigations

| Attack                  | Mitigation                                        |
| ----------------------- | ------------------------------------------------- |
| **Fake commitment**     | Circuit must verify hash computation equality     |
| **Amount manipulation** | Amount is public, but circuit proves relationship |
| **Address spoofing**    | Client address included in commitment             |
| **Replay attacks**      | Contract should track used proofs                 |
| **Front-running**       | Use commit-reveal atau time locks                 |

### 4. Soundness & Completeness

- **Completeness**: If statements are true, honest prover can create valid proof
- **Soundness**: Dishonest prover cannot create valid proof with high probability
- **Zero-knowledge**: Verifier learns nothing about private inputs except validity

---

## Frontend Integration

### Input Preparation

```typescript
// smart-contract/frontend/src/lib/zk.ts

import { generateEncryptionKey } from "./encryption";
import { hashKeccak256 } from "./hash";

interface InvoicePrivateInputs {
  encryptionKey: string;
  clientNameHash: string;
  descriptionHash: string;
  clientAddressHash: string;
}

interface InvoicePublicInputs {
  amount: string; // in wei
  freelancerAddress: string;
  clientAddress: string;
  commitmentHash: string;
}

async function prepareInvoiceInputs(
  clientName: string,
  description: string,
  amount: string,
  freelancerAddress: string,
  clientAddress: string,
): Promise<{ private: InvoicePrivateInputs; public: InvoicePublicInputs }> {
  // 1. Generate encryption key (always unique per invoice)
  const encryptionKey = generateEncryptionKey();

  // 2. Hash private data
  const clientNameHash = await hashKeccak256(clientName);
  const descriptionHash = await hashKeccak256(description);
  const clientAddressHash = await hashKeccak256(clientAddress);

  // 3. Compute commitment
  // Note: This must match circuit's poseidon_hash order
  const commitmentHash = await computeCommitmentHash(
    encryptionKey,
    clientNameHash,
    descriptionHash,
    clientAddressHash,
  );

  return {
    private: {
      encryptionKey,
      clientNameHash,
      descriptionHash,
      clientAddressHash,
    },
    public: {
      amount,
      freelancerAddress,
      clientAddress,
      commitmentHash,
    },
  };
}

async function computeCommitmentHash(
  encryptionKey: string,
  clientNameHash: string,
  descriptionHash: string,
  clientAddressHash: string,
): Promise<string> {
  // Use Poseidon hash - must match circuit exactly
  // In practice: use @noir-lang/barretenberg for hash computation
  const inputs = [
    encryptionKey,
    clientNameHash,
    descriptionHash,
    clientAddressHash,
  ];

  return await poseidonHash(inputs);
}
```

### Proof Generation

```typescript
// smart-contract/frontend/src/lib/proof.ts

import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { init, getZKHonkCallData } from "garaga";
import { InvoicePrivateInputs, InvoicePublicInputs } from "./types";

export async function generateInvoiceProof(
  privateInputs: InvoicePrivateInputs,
  publicInputs: InvoicePublicInputs,
): Promise<{ proof: Uint8Array; callData: bigint[] }> {
  await init();

  // 1. Prepare witness input
  const witnessInput = {
    encryption_key: privateInputs.encryptionKey,
    client_name_hash: privateInputs.clientNameHash,
    description_hash: privateInputs.descriptionHash,
    client_address_hash: privateInputs.clientAddressHash,
    amount: publicInputs.amount,
    freelancer_address: publicInputs.freelancerAddress,
    client_address: publicInputs.clientAddress,
    commitment_hash: publicInputs.commitmentHash,
  };

  // 2. Execute Noir circuit to generate witness
  const noir = new Noir(circuitArtifact);
  const execResult = await noir.execute(witnessInput);

  // 3. Generate UltraHonk proof
  const backend = new UltraHonkBackend(bytecode);
  const proof = await backend.generateProof(execResult.witness, {
    starknet: true,
  });

  // 4. Convert to Starknet calldata
  const callData = getZKHonkCallData(
    proof.proof,
    [
      publicInputs.commitmentHash,
      publicInputs.amount,
      publicInputs.freelancerAddress,
      publicInputs.clientAddress,
    ],
    verifyingKey,
  );

  return { proof: proof.proof, callData };
}
```

---

## Smart Contract Integration

### Cairo Contract Interface

```cairo
// smart-contract/contracts/src/morita_invoice.cairo

#[starknet::interface]
pub trait IMoritaInvoice<T> {
    fn create_invoice(
        ref self: T,
        // UltraHonk proof call data
        proof_calldata: Array<felt252>,
        // Public inputs
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        freelancer_address: ContractAddress,
        client_address: ContractAddress,
        deadline: u64,
    ) -> u256;

    fn verify_invoice(
        self: @T,
        invoice_id: u256,
    ) -> bool;

    fn pay_invoice(
        ref self: T,
        invoice_id: u256,
    );

    fn get_invoice(
        self: @T,
        invoice_id: u256,
    ) -> InvoiceInfo;
}

#[derive(Clone, Drop, Serde, starknet::Store)]
pub struct InvoiceInfo {
    pub commitment_hash: felt252,
    pub amount: u256,
    pub freelancer_address: ContractAddress,
    pub client_address: ContractAddress,
    pub deadline: u64,
    pub status: u8,  // 0=Pending, 1=Paid, 2=Expired
    pub payer: ContractAddress,
    pub created_at: u64,
}
```

### Verifier Integration

```cairo
// Call to Honk verifier contract

#[starknet::contract]
pub mod MoritaInvoice {
    // ... imports

    const VERIFIER_ADDRESS: felt252 = 0x...;  // Deploy verifier first

    #[external]
    fn create_invoice(
        ref self: ContractState,
        proof_calldata: Array<felt252>,
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        freelancer_address: ContractAddress,
        client_address: ContractAddress,
        deadline: u64,
    ) -> u256 {
        // 1. Verify ZK proof
        let verifier = IHonkVerifierDispatcher {
            contract_address: contract_address_const::<VERIFIER_ADDRESS>()
        };

        // Public inputs untuk verification
        let mut public_inputs = ArrayTrait::new();
        public_inputs.append(commitment_hash);
        public_inputs.append(amount_low.into());
        public_inputs.append(amount_high.into());
        public_inputs.append(freelancer_address.into());
        public_inputs.append(client_address.into());

        let is_valid = verifier.verify(
            proof_calldata,
            public_inputs
        );
        assert(is_valid, 'Invalid ZK proof');

        // 2. Check deadline not passed
        let current_time = get_block_timestamp();
        assert(current_time < deadline, 'Invoice expired');

        // 3. Create invoice
        // ... (invoice creation logic)
    }

    #[external]
    fn pay_invoice(ref self: ContractState, invoice_id: u256) {
        let caller = get_caller_address();
        let invoice = self.invoices.read(invoice_id);

        // CRITICAL: Only client can pay this invoice
        assert(caller == invoice.client_address, 'ONLY_CLIENT_CAN_PAY');

        // ... (payment logic)
    }
}
```

---

## Testing Strategy

### Unit Tests (Circuit-Level)

```noir
// Circuit tests would verify:
// 1. Valid invoice passes
// 2. Invalid amount fails
// 3. Non-zero addresses required
// 4. Different addresses required
// 5. Commitment verification
```

### Integration Tests

```typescript
// Frontend tests:
// 1. Generate proof with valid inputs ✓
// 2. Verify proof on-chain ✓
// 3. Payment with wrong address fails ✓
// 4. Payment with correct address succeeds ✓
// 5. Double payment prevented ✓
```

---

## Next Steps

### Immediate Actions

1. **Update circuit**: Implement new circuit di [`smart-contract/circuit/src/main.nr`](smart-contract/circuit/src/main.nr)
2. **Compile**: Run `nargo compile` to generate new artifacts
3. **Deploy verifier**: Deploy Starknet verifier contract
4. **Update frontend**: Modify `frontend/src/lib/zk.ts` untuk new inputs
5. **Test**: Integration test dengan all parties

### Future Enhancements

1. **Merkle tree whitelisting**: Allow organizations to pre-register client addresses
2. **Partial disclosure**: Implement selective reveal (e.g., show only amount)
3. **Recursive proofs**: Enable composable invoice bundles
4. **Multi-currency**: Support ERC-20 dan native ETH payments
5. **Deadline enforcement**: Automatic expiration dengan ZK time proofs

---

## References

- [Noir Documentation](https://noir-lang.org)
- [Garaga Documentation](https://github.com/garaga-org/garaga)
- [UltraHonk Backend](https://github.com/AztecProtocol/barretenberg)
- [Starknet Contracts](https://docs.starknet.io)
- [Poseidon Hash](https://www.poseidon-hash.info)

---

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Status:** Ready for Implementation
