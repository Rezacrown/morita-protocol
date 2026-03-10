#[starknet::contract]
mod MoritaInvoice {
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry};

    use super::super::structs::{Invoice, InvoiceStatus};
    use super::super::events::{InvoiceCreated, InvoicePaid, InvoiceCancelled, MoritaInvoiceEvent};
    use super::super::errors::MoritaInvoiceErrors;
    use super::super::i_morita_invoice::{IMoritaInvoice, IERC20Dispatcher, IERC20DispatcherTrait, IVerifierDispatcher, IVerifierDispatcherTrait};

    #[storage]
    struct Storage {
        invoices: Map<felt252, Invoice>,
        invoice_status: Map<felt252, InvoiceStatus>,
        owner: ContractAddress,
        fee_collector: ContractAddress,
        fee_bps: u16,
        strk_token: ContractAddress, 
        verifier_contract: ContractAddress, 
    }

    #[constructor]
    fn constructor(
        ref self: ContractState, 
        owner: ContractAddress, 
        fee_collector: ContractAddress,
        strk_token: ContractAddress,
        verifier_contract: ContractAddress
    ) {
        self.owner.write(owner);
        self.fee_collector.write(fee_collector);
        self.fee_bps.write(0);
        self.strk_token.write(strk_token);
        self.verifier_contract.write(verifier_contract);
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        MoritaInvoiceEvent: MoritaInvoiceEvent
    }

    #[abi(embed_v0)]
    impl MoritaInvoiceImpl of IMoritaInvoice<ContractState> {
        
        // 1. Create Invoice - Menerima encrypted payload untuk Frontend History
        fn create_invoice(
            ref self: ContractState,
            invoice_hash: felt252,
            amount_commitment: felt252,
            payee: ContractAddress,
            client_wallet: ContractAddress,
            amount: u256,
            due_date: u64,
            encrypted_payload: ByteArray
        ) {
            assert(amount.high == 0 && amount.low > 0, MoritaInvoiceErrors::INVALID_AMOUNT);
            assert(due_date > get_block_timestamp(), MoritaInvoiceErrors::INVALID_DUE_DATE);

            let existing_status = self.invoice_status.entry(invoice_hash).read();
            assert(existing_status == InvoiceStatus::Pending, MoritaInvoiceErrors::INVOICE_ALREADY_EXISTS);

            let created_at = get_block_timestamp();

            let invoice = Invoice {
                invoice_hash,
                amount_commitment,
                payee,
                client_wallet,
                created_at,
                due_date,
                amount,
                status: InvoiceStatus::Pending,
                is_verified: false,
            };

            self.invoices.entry(invoice_hash).write(invoice);
            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Pending);

            // Emit Event (Tempat kita menyimpan Encrypted String)
            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoiceCreated(InvoiceCreated {
                invoice_hash,
                payee,
                client_wallet,
                amount,
                amount_commitment,
                created_at,
                encrypted_payload, // Disimpan disini!
            })));
        }

        fn get_invoice_status(self: @ContractState, invoice_hash: felt252) -> InvoiceStatus {
            self.invoice_status.entry(invoice_hash).read()
        }

        fn get_invoice(self: @ContractState, invoice_hash: felt252) -> Invoice {
            self.invoices.entry(invoice_hash).read()
        }

        // 2. Pay Invoice - Langsung melakukan validasi ZK + Transfer
        fn pay_invoice(ref self: ContractState, invoice_hash: felt252, payment_proof: Array<felt252>) -> bool {
            let mut invoice = self.invoices.entry(invoice_hash).read();
            let current_status = self.invoice_status.entry(invoice_hash).read();
            assert(current_status == InvoiceStatus::Pending, MoritaInvoiceErrors::NOT_PENDING);

            // === A. ZK PROOF VERIFICATION ===
            let verifier = IVerifierDispatcher { contract_address: self.verifier_contract.read() };
            
            // Garaga verifier akan memvalidasi proof dan mengembalikan public inputs
            let public_inputs = verifier.verify_ultra_starknet_honk_proof(payment_proof.span())
                .expect(MoritaInvoiceErrors::PAYMENT_PROOF_INVALID);
            
            // Mengekstrak Array Public Inputs dari Proof (Sesuai urutan di sirkuit main.nr)
            // Konversi bertahap u256 -> felt252 -> Tipe Tujuan (karena tidak ada konversi langsung di Cairo)
            let payee_felt: felt252 = (*public_inputs.at(0)).try_into().unwrap();
            let proof_payee: ContractAddress = payee_felt.try_into().unwrap();
            
            let client_felt: felt252 = (*public_inputs.at(1)).try_into().unwrap();
            let proof_client: ContractAddress = client_felt.try_into().unwrap();
            
            // Timestamp aman dikonversi dari low part (u128) ke u64
            let proof_timestamp: u64 = (*public_inputs.at(2)).low.try_into().unwrap();
            
            let proof_invoice_hash: felt252 = (*public_inputs.at(3)).try_into().unwrap();
            let proof_amount_commitment: felt252 = (*public_inputs.at(4)).try_into().unwrap();

            // Memastikan bahwa Proof yang di-submit BENAR-BENAR untuk Invoice ini!
            assert(proof_payee == invoice.payee, MoritaInvoiceErrors::ZK_PAYEE_MISMATCH);
            assert(proof_client == invoice.client_wallet, MoritaInvoiceErrors::ZK_CLIENT_MISMATCH);
            assert(proof_timestamp == invoice.created_at, MoritaInvoiceErrors::ZK_TIMESTAMP_MISMATCH);
            assert(proof_invoice_hash == invoice_hash, MoritaInvoiceErrors::ZK_HASH_MISMATCH);
            assert(proof_amount_commitment == invoice.amount_commitment, MoritaInvoiceErrors::ZK_COMMITMENT_MISMATCH);

            let caller = get_caller_address();

            // === B. CHECKS-EFFECTS-INTERACTIONS ===
            // 1. Update State (Effects)
            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Paid);
            invoice.status = InvoiceStatus::Paid;
            invoice.is_verified = true;
            self.invoices.entry(invoice_hash).write(invoice);

            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoicePaid(InvoicePaid {
                invoice_hash,
                payer: caller,
                amount: invoice.amount,
                paid_at: get_block_timestamp(),
            })));

            // 2. Transfer STRK Token (Interactions)
            let fee_amount = (invoice.amount * self.fee_bps.read().into()) / 10000_u256;
            let payee_amount = invoice.amount - fee_amount;
            
            let strk = IERC20Dispatcher { contract_address: self.strk_token.read() };
            strk.transfer_from(caller, invoice.payee, payee_amount);
            if fee_amount > 0_u256 {
                strk.transfer_from(caller, self.fee_collector.read(), fee_amount);
            }

            true
        }

        fn cancel_invoice(ref self: ContractState, invoice_hash: felt252, reason: felt252) -> bool {
            let invoice = self.invoices.entry(invoice_hash).read();
            let caller = get_caller_address();
            assert(caller == invoice.payee || caller == self.owner.read(), MoritaInvoiceErrors::NOT_AUTHORIZED);
            assert(self.invoice_status.entry(invoice_hash).read() == InvoiceStatus::Pending, MoritaInvoiceErrors::NOT_CANCELLABLE);

            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Cancelled);
            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoiceCancelled(InvoiceCancelled {
                invoice_hash,
                cancelled_by: caller,
                reason,
            })));
            true
        }
    }
}