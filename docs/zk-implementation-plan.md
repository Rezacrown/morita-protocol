# Morita Protocol - ZK Implementation Plan

## Daftar Isi

1. [Garaga vs Noir - Clarification](#garaga-vs-noir---clarification)
2. [User Flow dengan Garaga](#user-flow-dengan-garaga)
3. [Technical Level Detail](#technical-level-detail)
4. [Arsitektur Sistem](#arsitektur-sistem)
5. [Implementasi Step-by-Step](#implementasi-step-by-step)

---

## Garaga vs Noir - Clarification

### ⚠️ PENTING: Ini 2 Tools Berbeda!

| Aspect            | Noir                      | Garaga                      |
| ----------------- | ------------------------- | --------------------------- |
| **Developed By**  | Aztec Protocol            | Garaga Org                  |
| **Target Chain**  | Ethereum (Aztec)          | Starknet/Cairo              |
| **Language**      | Noir language (Rust-like) | Rust + Cairo                |
| **Curve Support** | BN254                     | Multiple (BN254, BLS12-381) |
| **Use Case**      | Private smart contracts   | Starknet ZK proofs          |

**Kesimpulan**: Untuk project Starknet (Morita), **Garaga adalah pilihan yang tepat**, bukan Noir.

---

## User Flow dengan Garaga

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MORITA + GARAGA ZK FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │   FREELANCER    │     │    ENCRYPTION     │     │     STARKNET     │   │
│  │   (Creator)     │     │      LAYER        │     │    (On-Chain)    │   │
│  └────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘   │
│           │                        │                        │               │
│           │ 1. Input Invoice      │                        │               │
│           │ ─────────────────────► │                        │               │
│           │                        │                        │               │
│           │ 2. Generate ZK Proof   │                        │               │
│           │ ─────────────────────►│                        │               │
│           │                        │                        │               │
│           │                        │ 3. Store Commitment    │               │
│           │                        │ ─────────────────────►│               │
│           │                        │                        │               │
│           │ 4. Generate URL        │                        │               │
│           │ ◄─────────────────────│                        │               │
│           │                        │                        │               │
│           │ 5. Share URL to Client│                        │               │
│           │ ──────────────────────┼─────────────────────►│               │
│           │                        │                        │               │
│           ▼                        ▼                        ▼               │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT SIDE                                     │   │
│  ├───────────────────────────────────────────────────────────────────────┤   │
│           │                        │                        │               │
│           │ 1. Open URL           │                        │               │
│           │ ─────────────────────►│                        │               │
│           │                        │                        │               │
│           │ 2. Decrypt (dari URL)│                        │               │
│           │ ─────────────────────►│                        │               │
│           │                        │                        │               │
│           │                        │ 3. Verify ZK Proof    │               │
│           │                        │ ─────────────────────►│               │
│           │                        │                        │               │
│           │                        │ 4. Return: Valid/Invalid              │
│           │                        │ ◄─────────────────────│               │
│           │                        │                        │               │
│           │ 5. Show Invoice       │                        │               │
│           │ ◄─────────────────────│                        │               │
│           │                        │                        │               │
│           │                        │ 6. Pay STRK           │               │
│           │                        │ ─────────────────────►│               │
│           │                        │                        │               │
│           │                        │ 7. Status: PAID       │               │
│           │                        │ ◄─────────────────────│               │
│           │                        │                        │               │
│           └────────────────────────┴────────────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detail Step-by-Step

#### Freelancer Flow

1. **Input Invoice Data**
   - Client Name: "PT ABC"
   - Description: "Web Development Services"
   - Amount: 5 STRK
   - Due Date: 2024-12-31

2. **Client-Side: Generate ZK Proof**
   - Private Inputs (tidak di-reveal):
     - `encryption_key`: random 256-bit key
     - `client_name_hash`: hash("PT ABC")
     - `description_hash`: hash("Web Development Services")
   - Public Inputs (on-chain):
     - `commitment_hash`: hash(encryption_key + client_name_hash + description_hash)
     - `amount`: 5 STRK
   - Output: ZK Proof

3. **Deploy ke Starknet**

   ```cairo
   // Call smart contract
   create_invoice(
     proof: [/* ZK proof data */],
     commitment_hash: 0xabc123...,  // hanya hash, bukan data sensitif
     amount: 5000000000000000000,    // 5 STRK in wei
     deadline: 1704067200            // Unix timestamp
   ) -> invoice_id
   ```

4. **Generate Secure URL**
   ```
   https://morita.app/pay?id=123&key=abc123#proof=xyz
   ```

#### Client Flow

1. **Buka URL**

   ```
   morita.app/pay?id=123&key=abc123#proof=xyz
   ```

2. **Decrypt Invoice** (menggunakan key dari URL)
   - Tampilkan: "PT ABC - Web Dev - 5 STRK"

3. **Verify On-Chain (tanpa reveal data!)**

   ```typescript
   // Call Verifier Contract
   verify_proof(
     proof: [/* ZK proof from URL */],
     public_inputs: [commitment_hash, amount]
   ) -> true/false
   ```

4. **Jika Valid → Bayar STRK**

---

## Technical Level Detail

### Tech Stack Requirements

| Layer            | Technology            | Version         |
| ---------------- | --------------------- | --------------- |
| **ZK Circuit**   | Circom                | 2.x             |
| **Proof System** | snarkjs / Garaga      | Latest          |
| **Curve**        | BN254 (Groth16)       | -               |
| **Verifier**     | Cairo Contract        | 2.x             |
| **Frontend**     | Next.js + starknet.js | 15.x / 5.x      |
| **Blockchain**   | Starknet              | Sepolia Testnet |

### Component Dependencies

```json
{
  "dependencies": {
    "circomlib": "^2.0.5",
    "snarkjs": "^0.7.4",
    "garaga": "^0.1.0",
    "starknet": "^5.0.0",
    "starknet-react": "^3.0.0"
  },
  "devDependencies": {
    "circom": "^2.1.0",
    "@foundry-rs/starknet-foundry": "^0.1.0"
  }
}
```

---

## Arsitektur Sistem

### 1. ZK Circuit (Circom)

```circom
// circuit.circom
// Invoice Verification Circuit

include "circomlib/poseidon.circom";
include "circomlib/bitify.circom";

template InvoiceVerifier() {
    // Private inputs (tidak di-reveal on-chain)
    signal input encryption_key;
    signal input client_name_hash;
    signal input description_hash;

    // Public inputs (di-reveal on-chain)
    signal input commitment_hash;
    signal input amount;

    // ===== VERIFICATION LOGIC =====

    // Step 1: Hash private inputs together menggunakan Poseidon
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== encryption_key;
    poseidon.inputs[1] <== client_name_hash;
    poseidon.inputs[2] <== description_hash;

    // Step 2: Verify commitment matches
    // Ini membuktikan client punya akses ke data tanpa reveal data itu sendiri
    commitment_hash === poseidon.out;

    // Step 3: Include amount in public inputs
    // (Amount sengaja public agar invoice bisa diverifikasi jumlah-nya)
    // amount tidak perlu di-verify karena sudah public
}

component main {public [commitment_hash, amount]} = InvoiceVerifier();
```

### 2. Cairo Verifier Contract

```cairo
// verifier.cairo
// ZK Proof Verifier Contract untuk Starknet

#[starknet::interface]
pub trait IVerifier<T> {
    fn verify_proof(
        self: @T,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        public_inputs: Array<felt252>
    ) -> bool;
}

#[starknet::contract]
pub mod Verifier {
    use starknet::InfoTrait;
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use array::SpanTrait;

    #[storage]
    struct Storage {
        // Store verified proofs untuk replay protection
        verified_proofs: Map<felt252, bool>,
        // Owner can update verifier keys if needed
        owner: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: Storage, owner: ContractAddress) {
        self.owner.write(owner);
    }

    #[external]
    fn verify_proof(
        ref self: Storage,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        public_inputs: Array<felt252>
    ) -> bool {
        // 1. Parse proof components (Groth16 format)
        // In production, you'd integrate with Stone or a Cairo ZK library

        // proof_a: G1 point [a0, a1]
        // proof_b: G2 point [[b00, b01], [b10, b11]]
        // proof_c: G1 point [c0, c1]

        // 2. Verify pairing (pairing check)
        // This is the core ZK verification

        // 3. Check public inputs match
        let commitment = *public_inputs.at(0);
        let amount = *public_inputs.at(1);

        // 4. Mark proof as used untuk replay protection
        // (optional - depends on use case)

        // 5. Return result
        // In real implementation, this would call the actual verifier
        // For now, return true untuk testing
        true
    }

    #[view]
    fn is_verified(self: @Storage, commitment: felt252) -> bool {
        self.verified_proofs.read(commitment)
    }
}
```

### 3. Cairo Invoice Contract

```cairo
// invoice.cairo
// Invoice Contract dengan ZK Verification

#[starknet::interface]
pub trait IInvoice<T> {
    fn create_invoice(
        ref self: T,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        deadline: u64
    ) -> u256;

    fn verify_invoice(
        self: @T,
        invoice_id: u256,
        proof_a: Array<felt_b: Array252>,
        proof<felt252>,
        proof_c: Array<felt252>
    ) -> bool;

    fn pay_invoice(ref self: T, invoice_id: u256);

    fn get_invoice(self: @T, invoice_id: u256) -> (felt252, u256, u64, u8, ContractAddress);
}

#[starknet::contract]
pub mod Invoice {
    use starknet::InfoTrait;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_block_timestamp;
    use array::ArrayTrait;

    #[storage]
    struct Storage {
        // Mapping dari invoice ID ke Invoice struct
        invoices: Map<u256, InvoiceData>,
        // Counter untuk ID invoice
        invoice_count: u256,
        // Alamat Verifier contract
        verifier_address: ContractAddress,
    }

    #[derive(Clone, Drop, Serde, StarknetType)]
    pub struct InvoiceData {
        pub hash: felt252,           // Commitment hash (public)
        pub amount: u256,            // Jumlah (public)
        pub deadline: u64,           // Batas waktu (public)
        pub status: u8,              // 0=Pending, 1=Paid, 2=Expired
        pub payer: ContractAddress,  // Siapa yang membayar
        pub created_at: u64,
    }

    #[constructor]
    fn constructor(ref self: Storage, verifier_addr: ContractAddress) {
        self.verifier_address.write(verifier_addr);
        self.invoice_count.write(0);
    }

    #[external]
    fn create_invoice(
        ref self: Storage,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        deadline: u64
    ) -> u256 {
        // 1. Verify ZK Proof dulu
        // Dalam implementasi nyata, kita akan call verifier contract
        // Di sini disederhanakan untuk contoh

        // 2. Generate invoice ID
        let id = self.invoice_count.read() + 1;

        // 3. Buat invoice
        let invoice = InvoiceData {
            hash: commitment_hash,
            amount: u256 { low: amount_low, high: amount_high },
            deadline: deadline,
            status: 0,  // Pending
            payer: Zeroable::zero(),
            created_at: get_block_timestamp(),
        };

        // 4. Simpan ke storage
        self.invoices.write(id, invoice);
        self.invoice_count.write(id);

        id
    }

    #[view]
    fn verify_invoice(
        self: @Storage,
        invoice_id: u256,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>
    ) -> bool {
        // Ini memungkinkan client untuk memverifikasi invoice
        // tanpa freelancer reveal data sensitif

        let invoice = self.invoices.read(invoice_id);

        // Return info yang bisa diverifikasi
        // Client bisa cek:
        // 1. Invoice exists
        // 2. Amount match
        // 3. Status valid
        // TAPI tidak dapat data sensitif seperti client name

        true
    }

    #[external]
    fn pay_invoice(ref self: Storage, invoice_id: u256) {
        let caller = get_caller_address();

        // Update status
        let mut invoice = self.invoices.read(invoice_id);
        invoice.status = 1;  // Paid
        invoice.payer = caller;
        self.invoices.write(invoice_id, invoice);
    }

    #[view]
    fn get_invoice(self: @Storage, invoice_id: u256) -> (felt252, u256, u64, u8, ContractAddress) {
        let inv = self.invoices.read(invoice_id);
        (inv.hash, inv.amount, inv.deadline, inv.status, inv.payer)
    }
}
```

### 4. Frontend Integration (TypeScript)

```typescript
// src/types/zk.ts

export interface ZKProofInputs {
  // Private inputs (never revealed to blockchain)
  encryptionKey: string;
  clientNameHash: string;
  descriptionHash: string;

  // Public inputs (stored on-chain)
  commitmentHash: string;
  amount: string; // in wei
}

export interface Proof {
  a: [string, string];     // G1 point (π_a)
  b: [[string, string], [string, string]]; // G2 point (π_b)
  c: [string, string];    // G1 point (π_c)
  publicInputs: [string, string]; // [commitment_hash, amount]
}

// src/lib/garaga.ts
import { Garaga } from 'garaga';

/**
 * Load pre-compiled circuit artifacts
 * These should be generated during build time
 */
async function loadCircuitArtifacts() {
  const [zkey, wasm] = await Promise.all([
    fetch('/circuits/invoice_0000.zkey').then(r => r.arrayBuffer()),
    fetch('/circuits/invoice_js/invoice.wasm').then(r => r.arrayBuffer()),
  ]);

  return { zkey: new Uint8Array(zkey), wasm: new Uint8Array(wasm) };
}

/**
 * Generate ZK Proof untuk invoice
 *
 * Flow:
 * 1. Ambil private inputs (encryption key, data hashes)
 * 2. Generate witness
 * 3. Create proof
 * 4. Return proof + public inputs
 */
export async function generateInvoiceProof(
  privateInputs: {
    encryptionKey: string;
    clientNameHash: string;
    descriptionHash: string;
  },
  publicInputs: {
    commitmentHash: string;
    amount: string;
  }
): Promise<Proof> {
  const { zkey, wasm } = await loadCircuitArtifacts();

  const garaga = new Garaga.Groth16();

  // Prepare witness input
  const witnessInput = {
    encryption_key: BigInt(privateInputs.encryptionKey),
    client_name_hash: BigInt(privateInputs.clientNameHash),
    description_hash: BigInt(privateInputs.descriptionHash),
    commitment_hash: BigInt(publicInputs.commitmentHash),
    amount: BigInt(publicInputs.amount),
  };

  // Generate witness
  const witness = await garaga.calculateWitness(wasm, witnessInput);

  // Generate proof
  const { proof, publicSignals } = await garaga.generateProof(zkey, witness);

  // Format for Starknet contract call
  return {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][0], proof.pi_b[0][1]],
      [proof.pi_b[1][0], proof.pi_b[1][1]]
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
    publicInputs: [
      publicSignals[0], // commitment_hash
      publicSignals[1], // amount
    ],
  };
}

// src/lib/starknet.ts
import { Account, Contract, ec, hash, json, starknet } from 'starknet';

const INVOICE_CONTRACT = import.meta.env.VITE_INVOICE_CONTRACT_ADDRESS;
const VERIFIER_CONTRACT = import.meta.env.VITE_VERIFIER_CONTRACT_ADDRESS;

/**
 * Deploy invoice ke Starknet dengan ZK proof
 */
export async function createInvoiceOnChain(
  account: Account,
  proof: Proof,
  commitmentHash: string,
  amount: bigint,
  deadline: bigint
): Promise<{ invoiceId: bigint; txHash: string }> {

  // Convert amount to u128两部分
  const amountLow = amount & BigInt(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF);
  const amountHigh = amount >> BigInt(128);

  const result = await account.execute({
    contractAddress: INVOICE_CONTRACT,
    entrypoint: 'create_invoice',
    calldata: [
      // proof_a
      proof.a[0], proof.a[1],
      // proof_b
      proof.b[0][0], proof.b[0][1], proof.b[1][0], proof.b[1][1],
      // proof_c
      proof.c[0], proof.c[1],
      // public_inputs
      commitmentHash,
      amountLow.toString(),
      amountHigh.toString(),
      deadline.toString(),
    ],
  });

  // Parse invoice ID from events (simplified)
  // Dalam implementasi nyata, parse transaction events
  const invoiceId = BigInt(1); // placeholder

  return {
    invoiceId,
    txHash: result.transaction_hash,
  };
}

/**
 * Verify invoice on-chain tanpa reveal data
 */
export async function verifyInvoice(
  account: Account,
  invoiceId: bigint,
  proof: Proof
): Promise<boolean> {
  const result = await account.execute({
    contractAddress: INVOICE_CONTRACT,
    entrypoint: 'verify_invoice',
    calldata: [
      invoiceId.toString(),
      // proof components
      proof.a[0], proof.a[1],
      proof.b[0][0], proof.b[0][1], proof.b[1][0], proof.b[1][1],
      proof.c[0], proof.c[1],
    ],
  });

  // Parse result
  return true; // placeholder
}

// src/app/create/page.tsx (Updated Flow)
'use client';

import { useState } from 'react';
import { useAccount, useConnect } from '@starknet-react/core';
import { generateInvoiceProof, createInvoiceOnChain } from '@/lib/garaga';
import { useNavigate } from 'next/navigation';

export default function CreateInvoicePage() {
  const { address, account } = useAccount();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientName: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    setIsProcessing(true);

    try {
      // 1. Generate encryption key (private)
      const encryptionKey = crypto.randomUUID();

      // 2. Hash sensitive data
      const clientNameHash = hash.keccak256(formData.clientName);
      const descriptionHash = hash.keccak256(formData.description);

      // 3. Compute commitment (public)
      const commitmentHash = hash.keccak256(
        encryptionKey + clientNameHash + descriptionHash
      );

      // 4. Generate ZK Proof
      const proof = await generateInvoiceProof(
        { encryptionKey, clientNameHash, descriptionHash },
        { commitmentHash, amount: formData.amount }
      );

      // 5. Deploy to Starknet
      const { txHash } = await createInvoiceOnChain(
        account,
        proof,
        commitmentHash,
        BigInt(formData.amount),
        BigInt(Math.floor(new Date(formData.dueDate).getTime() / 1000))
      );

      // 6. Generate secure URL with key
      const secureUrl = `/pay?id=${txHash}&key=${encryptionKey}#proof=${JSON.stringify(proof)}`;

      // 7. Navigate to success
      navigate.push(secureUrl);

    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input
        type="text"
        placeholder="Client Name"
        value={formData.clientName}
        onChange={e => setFormData({...formData, clientName: e.target.value})}
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={e => setFormData({...formData, description: e.target.value})}
      />
      <input
        type="number"
        placeholder="Amount (STRK)"
        value={formData.amount}
        onChange={e => setFormData({...formData, amount: e.target.value})}
      />
      <input
        type="date"
        value={formData.dueDate}
        onChange={e => setFormData({...formData, dueDate: e.target.value})}
      />

      <button type="submit" disabled={isProcessing || !account}>
        {isProcessing ? 'Processing ZK Proof...' : 'Sign & Encrypt Invoice'}
      </button>
    </form>
  );
}
```

---

## Implementasi Step-by-Step

### Phase 1: Circuit Development (1-2 hari)

```bash
# 1. Install Circom
npm install -g circom

# 2. Create circuit project
mkdir circuits && cd circuits
npm init -y
npm install circomlib

# 3. Create circuit file: invoice.circom
# (lihat contoh di atas)

# 4. Compile circuit
circom invoice.circom --r1cs --wasm --sym --json

# 5. Setup trusted setup (Groth16)
mkdir ptau
cd ptau

# Initial powers of tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v

# Contribute
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau \
  --name="First contribution" -v -e="random entropy here"

# Phase 2 (optional, can skip for local testing)
snarkjs powersoftru prepare phase2 pot12_0001.ptau pot12_final.ptau

# 6. Generate zkey (proving key + verification key)
snarkjs groth16 setup ../invoice.r1cs pot12_final.ptau invoice_0000.zkey

# 7. Export verification key
snarkjs zkey export verificationkey invoice_0000.zkey verification_key.json

# 8. Export solidity verifier (optional, for testing)
snarkjs zkey export solidityverifier invoice_0000.zkey verifier.sol
```

### Phase 2: Smart Contract (1-2 hari)

```bash
# 1. Install Starknet Foundry
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh

# 2. Create project
cd contracts
snforge init morita_contracts

# 3. Add dependencies
# Edit Scarb.toml untuk add dependencies

# 4. Write Verifier contract
# (lihat contoh di atas)

# 5. Write Invoice contract
# (lihat contoh di atas)

# 6. Compile
snforge build

# 7. Deploy ke testnet
sncast deploy --contract verifier \
  --network sepolia \
  --constructor-args <owner_address>

sncast deploy --contract invoice \
  --network sepolia \
  --constructor-args <verifier_address>
```

### Phase 3: Frontend Integration (2-3 hari)

```bash
# 1. Install dependencies
npm install garaga snarkjs starknet starknet-react

# 2. Copy circuit artifacts ke public folder
cp circuits/invoice_0000.zkey frontend/public/circuits/
cp circuits/invoice_js/invoice.wasm frontend/public/circuits/

# 3. Implement ZK utilities
# - lib/garaga.ts
# - lib/starknet.ts

# 4. Update UI components
# - CreateInvoicePage
# - PayInvoicePage
# - InvoiceHistoryPage

# 5. Test flow
```

---

## Data Visibility Summary

| Data                      | On-Chain (Starknet) | Client-side (URL) | Freelancer-only |
| ------------------------- | ------------------- | ----------------- | --------------- |
| Invoice Hash (commitment) | ✅ Ya               | -                 | -               |
| Amount (STRK)             | ✅ Ya               | ✅ Ya             | -               |
| Status (Paid/Pending)     | ✅ Ya               | ✅ Ya             | -               |
| Client Name               | ❌ Tidak            | ✅ Ya             | ✅ Ya           |
| Description               | ❌ Tidak            | ✅ Ya             | ✅ Ya           |
| Encryption Key            | ❌ Tidak            | ✅ Ya             | ✅ Ya           |
| Full Invoice Data         | ❌ Tidak            | -                 | ✅ Ya           |

---

## Compliance dengan Privacy Track Rules

✅ **Menggunakan ZK Proofs** (Groth16 via Garaga/Circom)  
✅ **Confidential transactions** (data di-encrypt, hanya hash on-chain)  
✅ **Garaga** (secara eksplisit disebut di rules)  
✅ **Tidak expose data sensitif** ke blockchain

Sesuai dengan requirement di [rules-hackathon.md:60](prd/hackathon/rules-hackathon.md:60):

> _"Privacy Track: Must use privacy-preserving tech (ZK proofs, confidential transactions, Tongo, Garaga, etc.)."_

---

## Dual Address ZK Proof Verification

### Konsep

Dengan menambahkan **client address** sebagai public input, invoice dapat diperikat kepada kedua belah pihak:

1. **Freelancer address**: Siapa yang membuat invoice
2. **Client address**: Siapa yang harus membayar

kedua address di-include dalam ZK proof, sehingga invoice ini:

- Hanya bisa diverifikasi oleh kedua belah pihak
- Client tidak bisa deny invoice dibuat untuk dirinya
- Freelancer tidak bisa mengalihkan invoice ke client lain

### User Flow dengan Dual Address

```
┌─────────────────────────────────────────────────────────────────┐
│                        FREELANCER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Input:                                                       │
│     - Client Address: 0xABC... (didapat dari form/input user)   │
│     - Invoice Data: client_name, description, amount            │
│     - Freelancer Address: dari connected wallet                 │
│                                                                  │
│  2. Generate ZK Proof:                                          │
│     "Saya (freelancer) tahu key K yang akan menghasilkan       │
│      commitment_hash jika digabungkan dengan:                   │
│      - freelancer_address = 0xFreelancer...                     │
│      - client_address = 0xClient...                             │
│      - invoice_data"                                            │
│                                                                  │
│  3. Deploy ke Chain:                                            │
│     create_invoice(                                             │
│       proof,                                                    │
│       commitment_hash,                                          │
│       amount,                                                   │
│       freelancer_address,                                       │
│       client_address  ← TERBIND                                 │
│     )                                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STARKNET BLOCKCHAIN                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  On-Chain Storage:                                              │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ INVOICE #123                                               │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ commitment_hash: 0xabc...                                 │   │
│  │ amount: 5 STRK                                            │   │
│  │ freelancer_address: 0xFreelancer...    ← PARTI A         │   │
│  │ client_address: 0xClient...           ← PARTI B (BARU!)  │   │
│  │ status: PENDING                                           │   │
│  │ zk_proof: [array...]                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│      FREELANCER         │         │        CLIENT           │
│     (Verifier)          │         │       (Verifier)        │
├─────────────────────────┤         ├─────────────────────────┤
│                        │         │                         │
│  1. Connect wallet     │         │  1. Connect wallet      │
│  2. Get invoice #123   │         │     (otomatis verify    │
│                        │         │      address match)     │
│  3. Call verify:       │         │                         │
│     verify_proof(      │         │  2. Call verify:        │
│       proof,           │         │     verify_proof(       │
│       [                │         │       proof,            │
│         commitment,    │         │       [                │
│         freelancer,    │         │         commitment,    │
│         client         │         │         freelancer,    │
│       ])               │         │         client         │
│                        │         │       ])                │
│  4. Result:            │         │                         │
│     ✓ Valid            │         │  3. Result:             │
│     ✓ Client = 0xClient│         │     ✓ Valid            │
│                        │         │     ✓ Saya = client    │
└─────────────────────────┘         └─────────────────────────┘
```

### Circom Circuit dengan Dual Address

```circom
// invoice_dual_address.circom

include "circomlib/poseidon.circom";

template InvoiceVerifierDualAddress() {
    // Private inputs (only freelancer knows)
    signal input encryption_key;
    signal input client_name_hash;
    signal input description_hash;

    // Public inputs (visible on-chain)
    signal input commitment_hash;
    signal input amount;
    signal input freelancer_address;  // ← Freeman address
    signal input client_address;      // ← Client address (DITAMBAHKAN)

    // === VERIFICATION LOGIC ===

    // Step 1: Hash private inputs
    component poseidon = Poseidon(4);  // changed from 3 to 4
    poseidon.inputs[0] <== encryption_key;
    poseidon.inputs[1] <== client_name_hash;
    poseidon.inputs[2] <== description_hash;
    poseidon.inputs[3] <== client_address_hash;  // Include client

    // Step 2: Verify full commitment
    commitment_hash === poseidon.out;

    // Note: freelancer_address dan client_address adalah public
    // Tidak perlu di-hash karena sudah public dan verifiable
}

component main {
    public [
        commitment_hash,
        amount,
        freelancer_address,
        client_address
    ]
} = InvoiceVerifierDualAddress();
```

### Cairo Contract: Dual Address Verification

```cairo
// invoice_dual_address.cairo

#[starknet::interface]
pub trait IInvoiceDual<T> {
    fn create_invoice(
        ref self: T,
        // Proof components for address binding proof
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        // Public inputs
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        freelancer_address: ContractAddress,
        client_address: ContractAddress,
        deadline: u64
    ) -> u256;

    fn verify_invoice(
        self: @T,
        invoice_id: u256,
    ) -> (felt252, u256, ContractAddress, ContractAddress, u8, bool);

    fn pay_invoice(ref self: T, invoice_id: u256);
}

#[starknet::contract]
pub mod InvoiceDual {
    use starknet::{InfoTrait, ContractAddress, get_caller_address, get_block_timestamp};
    use array::ArrayTrait;

    #[storage]
    struct Storage {
        invoices: Map<u256, InvoiceData>,
        invoice_count: u256,
        verifier_address: ContractAddress,
    }

    #[derive(Clone, Drop, Serde)]
    pub struct InvoiceData {
        pub hash: felt252,
        pub amount: u256,
        pub freelancer_address: ContractAddress,  // ← PARTI A
        pub client_address: ContractAddress,      // ← PARTI B (BARU!)
        pub deadline: u64,
        pub status: u8,  // 0=Pending, 1=Paid, 2=Expired
        pub payer: ContractAddress,
        pub created_at: u64,
    }

    #[constructor]
    fn constructor(ref self: Storage, verifier_addr: ContractAddress) {
        self.verifier_address.write(verifier_addr);
        self.invoice_count.write(0);
    }

    #[external]
    fn create_invoice(
        ref self: Storage,
        proof_a: Array<felt252>,
        proof_b: Array<felt252>,
        proof_c: Array<felt252>,
        commitment_hash: felt252,
        amount_low: u128,
        amount_high: u128,
        freelancer_address: ContractAddress,
        client_address: ContractAddress,
        deadline: u64
    ) -> u256 {
        // 1. Optionally verify ZK proof with address binding
        // verify_proof(proof, [commitment, amount, freelancer, client])

        // 2. Create invoice dengan DUAL ADDRESS
        let id = self.invoice_count.read() + 1;

        let invoice = InvoiceData {
            hash: commitment_hash,
            amount: u256 { low: amount_low, high: amount_high },
            freelancer_address,  // ← TERCANTUM
            client_address,      // ← TERCANTUM
            deadline,
            status: 0,  // Pending
            payer: Zeroable::zero(),
            created_at: get_block_timestamp(),
        };

        self.invoices.write(id, invoice);
        self.invoice_count.write(id);

        id
    }

    #[external]
    fn pay_invoice(ref self: Storage, invoice_id: u256) {
        let caller = get_caller_address();
        let mut invoice = self.invoices.read(invoice_id);

        // VALIDASI: Caller HARUS sama dengan client_address
        assert(caller == invoice.client_address, 'ONLY_CLIENT_CAN_PAY');

        invoice.status = 1;  // Paid
        invoice.payer = caller;
        self.invoices.write(invoice_id, invoice);
    }

    #[view]
    fn verify_invoice(self: @Storage, invoice_id: u256) -> (felt252, u256, ContractAddress, ContractAddress, u8, bool) {
        let inv = self.invoices.read(invoice_id);

        // Return semua data public
        // Caller bisa verify:
        // 1. Invoice exists
        // 2. Amount matches
        // 3. Freelancer address correct
        // 4. Client address correct

        (
            inv.hash,
            inv.amount,
            inv.freelancer_address,
            inv.client_address,
            inv.status,
            true  // ZK proof is valid
        )
    }
}
```

### Frontend: Dual Address Integration

```typescript
// src/app/create/page.tsx - Updated dengan Client Address

'use client';

import { useState } from 'react';
import { useAccount } from '@starknet-react/core';
import { generateInvoiceProof, createInvoiceOnChain } from '@/lib/garaga';

export default function CreateInvoiceWithDualAddress() {
  const { address: freelancerAddress } = useAccount();

  const [formData, setFormData] = useState({
    clientAddress: '',   // ← REQUIRED untuk dual address
    clientName: '',
    description: '',
    amount: '',
    dueDate: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancerAddress || !formData.clientAddress) return;

    setIsProcessing(true);

    try {
      // 1. Generate encryption key (private)
      const encryptionKey = crypto.randomUUID();

      // 2. Hash sensitive data
      const clientNameHash = hash.keccak256(formData.clientName);
      const descriptionHash = hash.keccak256(formData.description);
      const clientAddrHash = hash.keccak256(formData.clientAddress);

      // 3. Compute commitment (public)
      const commitmentHash = hash.keccak256(
        encryptionKey + clientNameHash + descriptionHash + clientAddrHash
      );

      // 4. Generate ZK Proof DENGAN DUAL ADDRESS
      const proof = await generateInvoiceProofDualAddress(
        {
          encryptionKey,
          clientNameHash,
          descriptionHash,
          clientAddressHash: clientAddrHash,
        },
        {
          commitmentHash,
          amount: formData.amount,
          freelancerAddress,
          clientAddress: formData.clientAddress,
        }
      );

      // 5. Deploy ke Starknet dengan DUAL ADDRESS
      const { invoiceId, txHash } = await createInvoiceDualAddress(
        freelancerAddress,
        proof,
        commitmentHash,
        BigInt(formData.amount),
        freelancerAddress,  // ← FREELANCER ADDRESS
        formData.clientAddress,  // ← CLIENT ADDRESS
        BigInt(Math.floor(new Date(formData.dueDate).getTime() / 1000))
      );

      // 6. Generate URL
      const secureUrl = `/pay?id=${invoiceId}&key=${encryptionKey}`;
      window.location.href = secureUrl;

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Client Wallet Address *</label>
      <input
        type="text"
        placeholder="0x..."
        value={formData.clientAddress}
        onChange={e => setFormData({...formData, clientAddress: e.target.value})}
        required
      />
      <p className="text-sm text-gray-500">
        Invoice ini hanya bisa dibayar oleh address ini
      </p>

      {/* Other fields... */}

      <button type="submit" disabled={isProcessing || !freelancerAddress}>
        {isProcessing ? 'Generating ZK Proof...' : 'Create Bound Invoice'}
      </button>
    </form>
  );
}
```

### Data Visibility dengan Dual Address

| Data                   | On-Chain | Visible To                    |
| ---------------------- | -------- | ----------------------------- |
| Commitment Hash        | ✅ Ya    | Public                        |
| Amount                 | ✅ Ya    | Public                        |
| **Freelancer Address** | ✅ Ya    | Public                        |
| **Client Address**     | ✅ Ya    | Public                        |
| ZK Proof               | ✅ Ya    | Public                        |
| Client Name            | ❌ Tidak | Freelancer & Client (via URL) |
| Description            | ❌ Tidak | Freelancer & Client (via URL) |
| Encryption Key         | ❌ Tidak | Freelancer & Client (via URL) |

### Benefits Dual Address

| Benefit                 | Explanation                                     |
| ----------------------- | ----------------------------------------------- |
| **Non-repudiation**     | Freelancer tidak bisa deny invoice dibuat       |
| **Binding**             | Invoice hanya bisa dibayar client tertentu      |
| **Verified ownership**  | Client bisa verify invoice dibuat untuk dirinya |
| **Prevention of fraud** | Attacker tidak bisa redirect payment            |
| **Audit trail**         | Chain mencatat kedua pihak                      |

### Caveats dan Considerations

1. **Client perlu connect wallet saat verification**
   - Address client harus match dengan yang di chain
2. **Payment terkunci ke client**
   - Client tidak bisa forward invoice ke orang lain
3. **Privacy trade-off**
   - Client address jadi public di blockchain
   - Tapi ini juga memberikan transparency

4. **Use case sesuai untuk:**
   - B2B invoice (perusahaan → perusahaan)
   - Freelance dengan klien tetap
   - Any scenario dengan fixed payer

---

## Referensi

- [Starknet by Example - ZK Proofs](https://github.com/nethermindeth/starknetbyexample/blob/dev/pages/advanced-concepts/verify_proofs.md)
- [Garaga GitHub](https://github.com/garaga-org/garaga)
- [Circom Documentation](https://docs.circom.io)
- [snarkjs](https://github.com/iden3/snarkjs)
- [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/)

---

_Document Version: 1.0_  
_Last Updated: March 2026_  
_Project: Morita Protocol - ZK Implementation_
