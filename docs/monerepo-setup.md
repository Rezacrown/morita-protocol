# Morita Protocol Monorepo Setup (Independent Installations)

Dokumen ini menjelaskan setup monorepo untuk project Morita Protocol dengan struktur **independent installations** - artinya setiap workspace (frontend, smart-contract) menangani dependency-nya sendiri, tapi tetap share artifacts melalui folder terpusat.

---

## Current Project Structure

```
morita-protocol/
├── frontend/              # Next.js app (udah ada)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── bun.lock
├── smart-contract/        # Noir + Cairo + Vite demo (udah ada)
│   ├── circuit/
│   ├── contracts/
│   ├── app/               # Vite demo app
│   ├── Makefile
│   └── package.json
├── docs/                  # Documentation
├── prd/                   # Product Requirements
├── template/
└── tasks/
```

---

## Struktur yang Ditargetkan

```
morita-protocol/
├── frontend/                   # Next.js 16 + Tailwind + TypeScript
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   │       └── zk.ts          # ← ZK proof generation (BARU)
│   ├── public/
│   │   └── artifacts/         # ← Copy dari smart-contract (BARU)
│   ├── package.json
│   └── bun.lock
├── smart-contract/            # Noir circuit + Cairo verifier
│   ├── circuit/               # Noir ZK circuit
│   │   ├── src/main.nr        # ← Modify untuk invoice logic
│   │   ├── Nargo.toml
│   │   └── Prover.toml
│   ├── contracts/             # Cairo smart contracts
│   │   ├── verifier/          # Generated verifier contract
│   │   └── Scarb.toml
│   ├── app/                   # Vite demo (ARSIP / Reference only)
│   ├── Makefile               # Build scripts
│   └── package.json
├── artifacts/                 # SHARED FOLDER ← (BARU)
│   ├── circuit.json
│   ├── vk.bin
│   └── verifier.json
└── README.md
```

---

## Setup Steps (Detailed)

### Step 1: Siapkan Artifacts Folder

```bash
# Di root morita-protocol/
mkdir -p artifacts
cd artifacts
touch .gitkeep
```

### Step 2: Build Artifacts dari Smart-contract

```bash
cd smart-contract

# Install deps (kalo belum)
bun install

# Build Noir circuit
make build-circuit

# Generate verification key
make gen-vk

# Generate Cairo verifier contract
make gen-verifier

# Copy artifacts ke folder terpusat
cp app/src/assets/circuit.json ../artifacts/
cp app/src/assets/vk.bin ../artifacts/
cp app/src/assets/verifier.json ../artifacts/
```

**Catatan:** Kalian perlu run ini setiap kali circuit di-modify!

### Step 3: Install ZK Dependencies di Frontend

```bash
cd frontend

# Dependencies untuk ZK proof generation
bun add @noir-lang/noir_js @aztec/bb.js garaga

# Dependencies untuk Starknet interaction
bun add starknet @starknet-react/core @starknet-react/chains

# Optional: buat types
bun add -D @types/node
```

### Step 4: Copy Artifacts ke Frontend

```bash
# Cara 1: Symlink (recomended)
cd frontend/public
ln -s ../artifacts artifacts

# Cara 2: Copy manual (kalo symlink ga work di Windows)
cd frontend/public
mkdir -p artifacts
cp ../../artifacts/* artifacts/
```

### Step 5: Create ZK Library di Frontend

Buat file `frontend/src/lib/zk.ts`:

```typescript
/**
 * ZK Proof Generation Library
 * Uses Noir + UltraHonk backend + Garaga untuk Starknet integration
 */

import { Noir } from "@noir-lang/noir_js";
import { UltraHonkBackend } from "@aztec/bb.js";
import { getHonkCallData, init } from "garaga";

// Import artifacts
import circuitJson from "@/assets/circuit.json?raw";
import verifierAbiJson from "@/assets/verifier.json?raw";
import vkBinary from "@/assets/vk.bin?arraybuffer";

interface PrivateInputs {
  encryptionKey: string;
  clientNameHash: string;
  descriptionHash: string;
}

interface PublicInputs {
  amount: string;
  freelancerAddress: string;
  clientAddress: string;
}

interface ProofResult {
  proof: Uint8Array;
  publicInputs: string[];
  callData: string[];
}

export async function generateInvoiceProof(
  privateInputs: PrivateInputs,
  publicInputs: PublicInputs,
): Promise<ProofResult> {
  try {
    // Step 1: Initialize Garaga
    await init();

    // Step 2: Parse artifacts
    const circuit = JSON.parse(circuitJson);
    const verifierAbi = JSON.parse(verifierAbiJson);
    const vk = new Uint8Array(vkBinary);

    // Step 3: Prepare witness inputs
    const witnessInput = {
      private_inputs: {
        encryption_key: privateInputs.encryptionKey,
        client_name_hash: privateInputs.clientNameHash,
        description_hash: privateInputs.descriptionHash,
      },
      public_inputs: {
        amount: publicInputs.amount,
        freelancer_address: publicInputs.freelancerAddress,
        client_address: publicInputs.clientAddress,
      },
    };

    // Step 4: Generate witness
    const noir = new Noir({
      bytecode: Uint8Array.from(Buffer.from(circuit.bytecode, "hex")),
      abi: circuit.abi,
    });

    const execResult = await noir.execute(witnessInput);

    // Step 5: Generate UltraHonk proof
    const backend = new UltraHonkBackend(
      Uint8Array.from(Buffer.from(circuit.bytecode, "hex")),
      { threads: navigator.hardwareConcurrency || 4 },
    );

    const proof = await backend.generateProof(execResult.witness, {
      starknet: true,
    });

    // Cleanup backend
    backend.destroy();

    // Step 6: Convert ke Starknet calldata
    const callData = getHonkCallData(
      proof.proof,
      [
        publicInputs.amount,
        publicInputs.freelancerAddress,
        publicInputs.clientAddress,
      ],
      vk,
      1, // STARKNET flavor
    );

    return {
      proof: proof.proof,
      publicInputs: proof.publicInputs,
      callData: callData,
    };
  } catch (error) {
    console.error("Error generating ZK proof:", error);
    throw error;
  }
}

export async function verifyProofOnChain(
  verifierAddress: string,
  callData: string[],
): Promise<string> {
  // Ini akan dipanggil lewat useWriteContract dari @starknet-react/core
  return callData;
}

// Helper function untuk hash
export function hashKeccak256(data: string): string {
  // Implementasi hash Keccak256 atau pake library
  const crypto = require("crypto");
  return "0x" + crypto.createHash("sha3-256").update(data).digest("hex");
}
```

### Step 6: Update Create Page dengan ZK Integration

Update `frontend/src/app/create/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from '@starknet-react/core';
import { generateInvoiceProof, hashKeccak256 } from '@/lib/zk';

// Constants
const VERIFIER_ADDRESS = process.env.NEXT_PUBLIC_VERIFIER_ADDRESS!;

export default function CreateInvoicePage() {
  const { address: freelancerAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    clientAddress: '',
    clientName: '',
    description: '',
    amount: '',
    dueDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!freelancerAddress) {
      alert('Please connect wallet first');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Generate encryption key (random UUID)
      const encryptionKey = crypto.randomUUID();

      // Step 2: Hash private data
      const clientNameHash = hashKeccak256(formData.clientName);
      const descriptionHash = hashKeccak256(formData.description);

      // Step 3: Generate ZK proof
      const { callData } = await generateInvoiceProof(
        {
          encryptionKey,
          clientNameHash,
          descriptionHash
        },
        {
          amount: formData.amount,
          freelancerAddress,
          clientAddress: formData.clientAddress
        }
      );

      // Step 4: Deploy invoice ke blockchain
      const { transaction_hash } = await writeContractAsync({
        contractAddress: VERIFIER_ADDRESS,
        functionName: 'create_invoice',
        calldata: callData
      });

      // Step 5: Generate secure URL (encryption key via URL)
      const invoiceId = extractInvoiceIdFromTransaction(transaction_hash);
      const secureUrl = `/pay?id=${invoiceId}&key=${encryptionKey}`;

      // Redirect atau show success
      window.location.href = secureUrl;

    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. See console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Client Address (0x...)"
        value={formData.clientAddress}
        onChange={e => setFormData({...formData, clientAddress: e.target.value})}
      />
      <input
        placeholder="Client Name"
        value={formData.clientName}
        onChange={e => setFormData({...formData, clientName: e.target.value})}
      />
      <input
        placeholder="Description"
        value={formData.description}
        onChange={e => setFormData({...formData, description: e.target.value})}
      />
      <input
        placeholder="Amount (STRK)"
        type="number"
        value={formData.amount}
        onChange={e => setFormData({...formData, amount: e.target.value})}
      />
      <input
        type="date"
        value={formData.dueDate}
        onChange={e => setFormData({...formData, dueDate: e.target.value})}
      />
      <button
        type="submit"
        disabled={isProcessing || !freelancerAddress}
      >
        {isProcessing ? 'Generating ZK Proof...' : 'Create Invoice'}
      </button>
    </form>
  );
}
```

---

## Dependency Management Matrix

### smart-contract/package.json

```json
{
  "name": "morita-smart-contract",
  "private": true,
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "@noir-lang/noir_js": "^1.0.0-beta.6",
    "@aztec/bb.js": "^0.86.0-starknet.1",
    "garaga": "^0.18.1"
  }
}
```

### frontend/package.json

```json
{
  "name": "morita-frontend",
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "@starknet-react/core": "^0.22.0",
    "@starknet-react/chains": "^0.22.0",
    "starknet": "^6.11.0",
    "@noir-lang/noir_js": "^1.0.0-beta.6",
    "@aztec/bb.js": "^0.86.0-starknet.1",
    "garaga": "^0.18.1",
    "tailwindcss": "^4.0.0",
    "lucide-react": "^0.553.0",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

---

## Build Workflow

### Sequential Build (Manual)

```bash
# 1. Build circuit
cd smart-contract/circuit
nargo build

# 2. Generate VK
cd ../../smart-contract
bb write_vk -b ./circuit/target/circuit.json -o ./circuit/target

# 3. Generate verifier contract
cd contracts
garaga gen --system ultra_starknet_honk --vk ../circuit/target/vk --project-name verifier

# 4. Build verifier
cd verifier
scarb build

# 5. Deploy verifier (pake sncast)
# sncast deploy --class-hash <class_hash> --salt 0x0

# 6. Extract artifacts
cd ../../app/src/assets
cp ../../circuit/target/circuit.json .
cp ../../circuit/target/vk.pk .
cp ../../circuit/target/vk .
cp ../../contracts/verifier/target/release/verifier_UltraStarknetHonkVerifier.contract_class.json ./verifier.json

# 7. Copy ke artifacts folder (root)
cp ../../artifacts/* .

# 8. Copy ke frontend public
cp * ../../frontend/public/artifacts/
cp * ../../artifacts/
```

### Makefile Commands

Tambahin di `smart-contract/Makefile`:

```makefile
# Build everything
build-all: build-circuit gen-vk gen-verifier build-verifier extract-artifacts copy-artifacts

# Extract artifacts untuk consumption
extract-artifacts:
	cp app/src/assets/circuit.json ../artifacts/
	cp app/src/assets/vk.bin ../artifacts/
	cp app/src/assets/verifier.json ../artifacts/

# Copy ke frontend
copy-artifacts:
	cp app/src/assets/* ../../frontend/public/artifacts/

# Clean build artifacts
clean-artifacts:
	rm -f ../artifacts/*
	rm -f app/src/assets/*
```

---

## Environment Variables

### frontend/.env.local

```env
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
NEXT_PUBLIC_VERIFIER_ADDRESS=0x...
NEXT_PUBLIC_INVOICE_CONTRACT_ADDRESS=0x...  # Kalo ada contract terpisah
```

### smart-contract/.env

```env
STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io/rpc/v0_7
```

---

## Troubleshooting

### 1. "Module not found: @noir-lang/noir_js"

Pastikan install di workspace yang benar:

```bash
# Frontend
cd frontend && bun add @noir-lang/noir_js

# Smart-contract
cd smart-contract && bun add @noir-lang/noir_js
```

### 2. WASM initialization errors

Tambahin di `frontend/src/app/layout.tsx`:

```typescript
import { useEffect } from "react";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Initialize WASM untuk Noir
    if (typeof window !== "undefined") {
      Promise.all([
        fetch("/artifacts/acvm.wasm")
          .then((r) => r.arrayBuffer())
          .then((buf) => initACVM(buf)),
        fetch("/artifacts/noirc.wasm")
          .then((r) => r.arrayBuffer())
          .then((buf) => initNoirC(buf)),
      ]).then(() => console.log("WASM initialized"));
    }
  }, []);

  return children;
}
```

### 3. Artifacts not found

Pastikan folder structure dan paths:

```
frontend/public/
└── artifacts/
    ├── circuit.json
    ├── vk.bin
    └── verifier.json
```

Import di code:

```typescript
import circuitJson from "@/assets/circuit.json?raw"; // Next.js import
// ATA
import circuitJson from "../../public/artifacts/circuit.json";
```

---

## File Summary

| File              | Lokasi                        | Fungsi                  |
| ----------------- | ----------------------------- | ----------------------- |
| `zk.ts`           | `frontend/src/lib/`           | ZK proof generation     |
| `create/page.tsx` | `frontend/src/app/create/`    | Form creation dengan ZK |
| `artifacts/`      | `frontend/public/`            | Shared artifacts        |
| `main.nr`         | `smart-contract/circuit/src/` | Noir circuit logic      |
| `verifier/`       | `smart-contract/contracts/`   | Cairo verifier contract |

---

## Quick Commands Reference

### Install Dependencies

```bash
# Frontend ZK deps
cd frontend && bun add @noir-lang/noir_js @aztec/bb.js garaga

# Frontend Starknet deps
bun add starknet @starknet-react/core @starknet-react/chains
```

### Build Artifacts

```bash
cd smart-contract
make build-circuit && make gen-vk && make gen-verifier
cp app/src/assets/* ../artifacts/
cp app/src/assets/* ../../frontend/public/artifacts/
```

### Run Development

```bash
# Frontend
cd frontend && bun run dev

# Smart-contract (Vite demo)
cd smart-contract/app && bun run dev
```

---

## Next Steps Checklist

- [ ] Setup artifacts folder di root
- [ ] Build circuit dan extract artifacts
- [ ] Install dependencies di frontend
- [ ] Create `lib/zk.ts`
- [ ] Update `create/page.tsx`
- [ ] Deploy verifier ke Starknet testnet
- [ ] Test end-to-end flow
