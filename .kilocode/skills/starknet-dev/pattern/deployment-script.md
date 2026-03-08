# Template Deployment Script

Template ini menyediakan script untuk declare, deploy, dan verify kontrak Cairo menggunakan sncast.

## 1. Menggunakan Sncast

### Declare Kontrak

```bash
# Declare kontrak ke network
sncast declare --path ./src/my_contract.cairo \
    --network mainnet \
    --account my_account \
    --max-fee 1000000000000000
```

Output akan memberikan class hash yang diperlukan untuk deployment.

### Deploy Kontrak

```bash
# Deploy dengan constructor arguments
sncast deploy \
    --class-hash 0x1234567890abcdef... \
    --constructor-calldata 0xowner_address 0x1000000 \
    --network mainnet \
    --account my_account \
    --max-fee 1000000000000000
```

## 2. Python Script Deployment

Template script deployment lengkap menggunakan Python:

```python
#!/usr/bin/env python3
"""
Deployment Script untuk Kontrak Starknet
"""

import os
import json
import asyncio
from typing import Optional
from dataclasses import dataclass

@dataclass
class NetworkConfig:
    rpc_url: str
    chain_id: str
    account_address: str
    private_key: str

class StarknetDeployer:
    def __init__(self, config: NetworkConfig):
        self.config = config
        self.provider = None
        self.account = None

    async def connect(self):
        """Connect ke Starknet network"""
        from starknet_py.net import RpcProvider
        from starknet_py.net.account.account import Account
        from starknet_py.net.models import StarknetChainId
        from starknet_py.key_pair import KeyPair

        chain_id_map = {
            "mainnet": StarknetChainId.MAINNET,
            "testnet": StarknetChainId.TESTNET,
            "testnet2": StarknetChainId.TESTNET2,
        }

        self.provider = RpcProvider(node_url=self.config.rpc_url)

        key_pair = KeyPair.from_private_key(
            int(self.config.private_key, 16)
        )

        self.account = Account(
            address=int(self.config.account_address, 16),
            key_pair=key_pair,
            chain_id=chain_id_map[self.config.chain_id],
            provider=self.provider
        )

        print(f"Connected to {self.config.chain_id}")
        print(f"Account: {self.config.account_address}")

    async def declare_contract(self, contract_path: str) -> str:
        """Declare kontrak dan kembalikan class hash"""
        from starknet_py.contract import Contract

        # Compile contract jika perlu
        compiled = f"{contract_path.replace('.cairo', '')}.json"

        if not os.path.exists(compiled):
            print(f"Error: Compiled contract not found: {compiled}")
            print("Please compile your contract first: scarb build")
            return None

        with open(compiled, "r") as f:
            contract_definition = json.load(f)

        # Declare
        declare_result = await self.account.declare(
            contract=contract_definition,
            max_fee=int(1e16)  # 0.01 ETH
        )

        print(f"Declare transaction: {declare_result.transaction_hash}")
        await self.provider.wait_for_tx(declare_result.transaction_hash)

        class_hash = hex(declare_result.class_hash)
        print(f"Class Hash: {class_hash}")

        return class_hash

    async def deploy_contract(
        self,
        class_hash: str,
        constructor_args: list,
        salt: Optional[int] = None
    ) -> str:
        """Deploy kontrak dengan constructor arguments"""
        from starknet_py.contract import Contract, ContractFunctionCallSerializer

        # Serialize constructor arguments
        # Sesuaikan dengan ABI kontrak Anda
        # Contoh: [address, uint256]

        deploy_result = await self.account.deploy(
            class_hash=int(class_hash, 16),
            constructor_calldata=constructor_args,
            salt=salt,
            max_fee=int(1e16)
        )

        print(f"Deploy transaction: {deploy_result.transaction_hash}")
        await self.provider.wait_for_tx(deploy_result.transaction_hash)

        deployed_address = hex(deploy_result.address)
        print(f"Deployed at: {deployed_address}")

        return deployed_address

    async def verify_on_explorer(self, tx_hash: str):
        """Print link ke explorer"""
        explorers = {
            "mainnet": "starkscan.co",
            "testnet": "testnet.starkscan.co",
            "testnet2": "testnet-2.starkscan.co",
        }

        explorer = explorers.get(self.config.chain_id, "starkscan.co")
        print(f"View on explorer: https://{explorer}/tx/0x{tx_hash[2:]}")


async def main():
    # Konfigurasi
    config = NetworkConfig(
        rpc_url=os.environ.get("STARKNET_RPC_URL", "https://api.cartridge.gg/x/starknet/main"),
        chain_id=os.environ.get("STARKNET_CHAIN_ID", "mainnet"),
        account_address=os.environ["ACCOUNT_ADDRESS"],
        private_key=os.environ["PRIVATE_KEY"],
    )

    deployer = StarknetDeployer(config)
    await deployer.connect()

    # Step 1: Declare
    print("\n=== Step 1: Declare Contract ===")
    class_hash = await deployer.declare_contract("./src/my_contract.cairo")

    if not class_hash:
        print("Failed to declare contract")
        return

    # Step 2: Deploy
    print("\n=== Step 2: Deploy Contract ===")
    # Contoh constructor args: owner address dan initial value
    constructor_args = [
        int(config.account_address, 16),  # owner
        1000, 0  # uint256: 1000
    ]

    address = await deployer.deploy_contract(
        class_hash=class_hash,
        constructor_args=constructor_args
    )

    # Save deployment info
    deployment_info = {
        "class_hash": class_hash,
        "address "network": config.chain_id,
   ": address,
        }

    with open("deployment.json", "w") as f:
        json.dump(deployment_info, f, indent=2)

    print("\n=== Deployment Complete ===")
    print(f"Contract Address: {address}")
    print("Saved to deployment.json")


if __name__ == "__main__":
    asyncio.run(main())
```

## 3. Environment Variables

Buat file `.env`:

```bash
# Network
STARKNET_RPC_URL=https://api.cartridge.gg/x/starknet/main
STARKNET_CHAIN_ID=mainnet

# Account
ACCOUNT_ADDRESS=0x123...
PRIVATE_KEY=0xabc...
```

## 4. Execute Script

```bash
# Install dependencies
pip install starknet-py python-dotenv

# Setup environment
cp .env.example .env
# Edit .env dengan akun Anda

# Run deployment
python deploy.py
```

## 5. Deploy dengan Constructor Complex

### ERC20 Token Deployment

```python
# ERC20 constructor args:
# name: felt252
# symbol: felt252
# decimals: u8
# initial_supply: u256
# recipient: ContractAddress
# owner: ContractAddress

constructor_args = [
    # name (felt252) - encode as int from short string
    112774758459772246702749056,  # "MyToken"
    # symbol
    7883500511021602544,          # "MTK"
    # decimals
    18,
    # initial_supply (uint256)
    1000000, 0,
    # recipient
    int(recipient_address, 16),
    # owner
    int(owner_address, 16),
]
```

## 6. Best Practices

1. **Estimate fee** sebelum deployment sebenarnya
2. **Simpan class hash** untuk deployment future
3. **Use multisig** untuk production deployments
4. **Verify** kontrak di explorer setelah deploy
5. **Testnet first** - selalu test di testnet dulu
