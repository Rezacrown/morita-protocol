install-bun:
	curl -fsSL https://bun.sh/install | bash

install-noir:
	curl -L https://raw.githubusercontent.com/noir-lang/noirup/refs/heads/main/install | bash
	noirup --version 1.0.0-beta.6

install-barretenberg:
	curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/refs/heads/next/barretenberg/bbup/install | bash
	bbup --version 0.86.0-starknet.1

install-starknet:
	curl --proto '=https' --tlsv1.2 -sSf https://sh.starkup.dev | sh

install-devnet:
	asdf plugin add starknet-devnet
	asdf install starknet-devnet 0.4.2

install-garaga:
	pip install garaga==0.18.1

install-app-deps:
	cd app && bun install

devnet:
	starknet-devnet --accounts=2 --seed=0 --initial-balance=100000000000000000000000

accounts-file:
	curl -s http://localhost:5050/rpc \
	-H "Content-Type: application/json" \
	-d '{"jsonrpc":"2.0","method":"devnet_getPredeployedAccounts","params":[],"id":1}' \
	| jq '{"alpha-sepolia":{"devnet0":{"address":.result[0].address,"private_key":.result[0].private_key,"public_key":.result[0].public_key,"class_hash":"0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6","deployed":true,"legacy":false,"salt":"0x14","type":"open_zeppelin"}}}' \
	> ./contracts/accounts.json

build-circuit:
	cd circuit && nargo build

exec-circuit:
	cd circuit && nargo execute witness

prove-circuit:
	bb prove --scheme ultra_honk --oracle_hash starknet -b ./circuit/target/invoice_commitment.json -w ./circuit/target/witness.gz -o ./circuit/target

gen-vk:
	bb write_vk --scheme ultra_honk --oracle_hash starknet -b ./circuit/target/invoice_commitment.json -o ./circuit/target

gen-verifier:
	cd contracts && garaga gen --system ultra_starknet_honk --vk ../circuit/target/vk --project-name verifier

build-verifier:
	cd contracts/verifier && scarb build

declare-verifier:
	cd contracts && sncast declare --contract-name UltraStarknetHonkVerifier --package verifier

deploy-verifier:
	# TODO: use class hash from the result of the `make declare-verifier` step
	cd contracts && sncast deploy --salt 0x00 --class-hash 0x1b3ccab9352d1a65d430fe8843aaa44cbea3398bc1ae169a4f5f7b96180920

# ========== MoritaInvoice Contract ==========

build-morita:
	cd contracts/morita_invoice && scarb build

declare-morita:
	cd contracts && sncast declare --contract-name MoritaInvoice --package morita_invoice

deploy-morita:
	# Deploy MoritaInvoice dengan constructor calldata:
	# owner, fee_collector, strk_token, verifier_contract
	# catatan: alamat devnet0 dari accounts.json
	cd contracts && sncast deploy \
    --salt 0x01 \
    --class-hash 0x15ef99e4fcf84115ef203d0b836ed258b89e3fe5140aed452db2d59dfa65583 \
    --constructor-calldata 0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6 0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6 0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1 0x45a5a403be8ddcc0246f9cbe3568b223118d7005127327ea15037fbd6ddea64

# ========== Full Devnet Deployment Script ==========

deploy-devnet: build-circuit gen-vk gen-verifier build-verifier build-morita
	@echo "=== Step 1: Starting Devnet ==="
	starknet-devnet --accounts=2 --seed=0 --initial-balance=100000000000000000000000 &
	@sleep 5
	@echo "=== Step 2: Fetching Accounts ==="
	curl -s http://localhost:5050/rpc \
		-H "Content-Type: application/json" \
		-d '{"jsonrpc":"2.0","method":"devnet_getPredeployedAccounts","params":[],"id":1}' \
		| jq '{"alpha-sepolia":{"devnet0":{"address":.result[0].address,"private_key":.result[0].private_key,"public_key":.result[0].public_key,"class_hash":"0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6","deployed":true,"legacy":false,"salt":"0x14","type":"open_zeppelin"}}}' \
		> ./contracts/accounts.json
	@echo "Accounts saved to contracts/accounts.json"
	@echo ""
	@echo "=== Step 3: Declare Verifier ==="
	cd contracts && sncast declare --contract-name UltraStarknetHonkVerifier --package verifier
	@echo ""
	@echo "=== Step 4: Deploy Verifier ==="
	@echo "Please run: make do-deploy-verifier CLASS_HASH=<class_hash_from_step_3>"
	@echo ""

do-deploy-verifier:
	@echo "=== Deploying Verifier ==="
	cd contracts && sncast deploy --salt 0x00 --class-hash $(CLASS_HASH)
	@echo ""
	@echo "VERIFIER_ADDRESS=<address_from_output> - simpan ini untuk step berikutnya"

do-deploy-morita:
	@echo "=== Deploying MoritaInvoice ==="
	cd contracts && sncast deploy \
		--salt 0x01 \
		--class-hash $(CLASS_HASH) \
		--constructor-calldata "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1,$(VERIFIER_ADDR)"
	@echo ""
	@echo "MORITA_ADDRESS=<address_from_output>"

# ========== Testing Commands ==========

test-integration:
	@echo "=== Testing Integration ==="
	@echo "1. Check Verifier Contract:"
	cd contracts && sncast call --contract-address $(VERIFIER_ADDR) --function "get_version" || echo "Verifier check"
	@echo ""
	@echo "2. Check MoritaInvoice Contract:"
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "owner"
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "verifier_contract"
	@echo ""
	@echo "3. Create Test Invoice (invoice_hash = 0x123):"
	cd contracts && sncast invoke \
		--contract-address $(MORITA_ADDR) \
		--function "create_invoice" \
		--calldata "0x123,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,1000000000000000000,1893456000"
	@echo ""
	@echo "4. Check Invoice Status:"
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "get_invoice_status" --calldata "0x123"

# ========== MoritaInvoice Contract ==========

build-morita:
	cd contracts/morita_invoice && scarb build

declare-morita:
	cd contracts && sncast declare --contract-name MoritaInvoice --package morita_invoice

deploy-morita:
	# Deploy MoritaInvoice dengan constructor calldata:
	# owner, fee_collector, strk_token, verifier_contract
	# catatan: alamat devnet0 dari accounts.json
	cd contracts && sncast deploy \
		--salt 0x01 \
		--class-hash 0x0209532ec5f3ea500653d4877bc891e866190bef8b7ab6ae7690d62ced910df0 \
		--constructor-calldata "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1,0x045a5a403be8ddcc0246f9cbe3568b223118d7005127327ea15037fbd6ddea64"

# ========== Full Devnet Deployment Script ==========

deploy-devnet: build-circuit gen-vk gen-verifier build-verifier build-morita
	@echo "=== Step 1: Starting Devnet ==="
	starknet-devnet --accounts=2 --seed=0 --initial-balance=100000000000000000000000 &
	@sleep 5
	@echo "=== Step 2: Fetching Accounts ==="
	curl -s http://localhost:5050/rpc \
		-H "Content-Type: application/json" \
		-d '{"jsonrpc":"2.0","method":"devnet_getPredeployedAccounts","params":[],"id":1}' \
		| jq '{"alpha-sepolia":{"devnet0":{"address":.result[0].address,"private_key":.result[0].private_key,"public_key":.result[0].public_key,"class_hash":"0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6","deployed":true,"legacy":false,"salt":"0x14","type":"open_zeppelin"}}}' \
		> ./contracts/accounts.json
	@echo "Accounts saved to contracts/accounts.json"
	@echo ""
	@echo "=== Step 3: Declare Verifier ==="
	cd contracts && sncast declare --contract-name UltraStarknetHonkVerifier --package verifier --accounts-file accounts.json --account devnet0
	@echo ""
	@echo "=== Step 4: Deploy Verifier ==="
	@echo "Please run: make do-deploy-verifier CLASS_HASH=<class_hash_from_step_3>"
	@echo ""

do-deploy-verifier:
	@echo "=== Deploying Verifier ==="
	cd contracts && sncast deploy --salt 0x00 --class-hash $(CLASS_HASH) --accounts-file accounts.json --account devnet0
	@echo ""
	@echo "VERIFIER_ADDRESS=<address_from_output> - simpan ini untuk step berikutnya"

do-deploy-morita:
	@echo "=== Deploying MoritaInvoice ==="
	cd contracts && sncast deploy \
		--salt 0x01 \
		--class-hash $(CLASS_HASH) \
		--constructor-calldata "0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82dc9dd7c1,$(VERIFIER_ADDR)" \
		--accounts-file accounts.json \
		--account devnet0
	@echo ""
	@echo "MORITA_ADDRESS=<address_from_output>"

# ========== Testing Commands ==========

test-integration:
	@echo "=== Testing Integration ==="
	@echo "1. Check Verifier Contract:"
	cd contracts && sncast call --contract-address $(VERIFIER_ADDR) --function "get_version" --accounts-file accounts.json --account devnet0 || echo "Verifier check"
	@echo ""
	@echo "2. Check MoritaInvoice Contract:"
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "owner" --accounts-file accounts.json --account devnet0
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "verifier_contract" --accounts-file accounts.json --account devnet0
	@echo ""
	@echo "3. Create Test Invoice (invoice_hash = 0x123):"
	cd contracts && sncast invoke \
		--contract-address $(MORITA_ADDR) \
		--function "create_invoice" \
		--calldata "0x123,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,0xe2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6,1000000000000000000,1893456000" \
		--accounts-file accounts.json \
		--account devnet0
	@echo ""
	@echo "4. Check Invoice Status:"
	cd contracts && sncast call --contract-address $(MORITA_ADDR) --function "get_invoice_status" --calldata "0x123" --accounts-file accounts.json --account devnet0

artifacts:
	cp ./circuit/target/invoice_commitment.json ../frontend/src/constants/assets/invoice_commitment.json
	cp ./circuit/target/vk ../frontend/src/constants/assets/vk.bin
	cp ./contracts/target/release/verifier_UltraStarknetHonkVerifier.contract_class.json ../frontend/src/constants/assets/verifier.json

run-app:
	cd app && bun run dev
