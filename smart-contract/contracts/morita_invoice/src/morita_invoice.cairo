#[starknet::contract]
mod MoritaInvoice {
    use starknet::{ContractAddress, get_block_timestamp, get_caller_address};
    use starknet::storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StoragePathEntry};
    use core::poseidon::poseidon_hash_span;

    use super::super::structs::{Invoice, InvoiceStatus};
    use super::super::events::{InvoiceCreated, InvoicePaid, InvoiceVerified, InvoiceCancelled, MoritaInvoiceEvent};
    use super::super::errors::MoritaInvoiceErrors;
    use super::super::i_morita_invoice::{IMoritaInvoice, IERC20Dispatcher, IERC20DispatcherTrait, IVerifierDispatcher, IVerifierDispatcherTrait};

    #[storage]
    struct Storage {
        invoices: Map<felt252, Invoice>,
        invoice_status: Map<felt252, InvoiceStatus>,
        payer_invoices: Map<(ContractAddress, u32), felt252>,
        payer_invoice_count: Map<ContractAddress, u32>,
        owner: ContractAddress,
        fee_collector: ContractAddress,
        fee_bps: u16,
        strk_token: ContractAddress, // Alamat ERC20 STRK
        verifier_contract: ContractAddress, // Alamat Honk Verifier
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
        
        fn create_invoice(
            ref self: ContractState,
            invoice_hash: felt252,
            payee: ContractAddress,
            client_wallet: ContractAddress,
            amount: u256,
            due_date: u64
        ) {
            assert(amount.high == 0 && amount.low > 0, MoritaInvoiceErrors::INVALID_AMOUNT);
            assert(due_date > get_block_timestamp(), MoritaInvoiceErrors::INVALID_DUE_DATE);

            let existing_status = self.invoice_status.entry(invoice_hash).read();
            assert(existing_status == InvoiceStatus::Pending, MoritaInvoiceErrors::INVOICE_ALREADY_EXISTS);

            let invoice = Invoice {
                invoice_hash,
                payee,
                client_wallet,
                created_at: get_block_timestamp(),
                due_date,
                amount,
                status: InvoiceStatus::Pending,
                is_verified: false,
            };

            self.invoices.entry(invoice_hash).write(invoice);
            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Pending);

            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoiceCreated(InvoiceCreated {
                invoice_hash,
                payee,
                client_wallet,
                amount,
                created_at: get_block_timestamp(),
            })));
        }

        fn get_invoice_status(self: @ContractState, invoice_hash: felt252) -> InvoiceStatus {
            self.invoice_status.entry(invoice_hash).read()
        }

        fn get_invoice(self: @ContractState, invoice_hash: felt252) -> Invoice {
            self.invoices.entry(invoice_hash).read()
        }

        fn pay_invoice(ref self: ContractState, invoice_hash: felt252, payment_proof: Array<felt252>) -> bool {
            let mut invoice = self.invoices.entry(invoice_hash).read();
            let current_status = self.invoice_status.entry(invoice_hash).read();
            assert(current_status == InvoiceStatus::Pending, MoritaInvoiceErrors::NOT_PENDING);

            // Verifikasi ZK Proof jika belum diverifikasi
            // FIXED Issue 1: Match honk_verifier interface dengan single Span<felt252> parameter
            if !invoice.is_verified {
                let verifier = IVerifierDispatcher { contract_address: self.verifier_contract.read() };
                
                // Gabungkan proof dan public_inputs menjadi single array sesuai honk_verifier interface
                let mut merged: Array<felt252> = core::array::ArrayTrait::new();
                
                // Clone payment_proof dan append ke merged
                let mut proof_clone = payment_proof.clone();
                let mut proof_span = proof_clone.span();
                loop {
                    if proof_span.len() == 0 {
                        break;
                    }
                    merged.append(*proof_span.pop_front().unwrap());
                };
                
                // Append public inputs
                merged.append(invoice_hash);
                merged.append(invoice.amount.low.into());
                
                let result = verifier.verify_ultra_starknet_honk_proof(merged.span());
                assert(result.is_some(), MoritaInvoiceErrors::PAYMENT_PROOF_INVALID);
            }

            let caller = get_caller_address();

            // Hitung platform fee
            let fee_amount = (invoice.amount * self.fee_bps.read().into()) / 10000_u256;
            let payee_amount = invoice.amount - fee_amount;

            // FIXED Issue 2: Checks-Effects-Interactions Pattern
            // Update state SEBELUM external calls untuk mencegah reentrancy attacks
            
            // 1. Update State terlebih dahulu
            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Paid);
            invoice.status = InvoiceStatus::Paid;
            self.invoices.entry(invoice_hash).write(invoice);

            let count = self.payer_invoice_count.entry(caller).read();
            self.payer_invoices.entry((caller, count)).write(invoice_hash);
            self.payer_invoice_count.entry(caller).write(count + 1);

            let proof_hash = poseidon_hash_span(payment_proof.span());

            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoicePaid(InvoicePaid {
                invoice_hash,
                payer: caller,
                amount: invoice.amount,
                paid_at: get_block_timestamp(),
                proof_hash,
            })));

            // 2. External calls (STRK transfer) SETELAH state updates
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

            let current_status = self.invoice_status.entry(invoice_hash).read();
            assert(current_status == InvoiceStatus::Pending, MoritaInvoiceErrors::NOT_CANCELLABLE);

            self.invoice_status.entry(invoice_hash).write(InvoiceStatus::Cancelled);
            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoiceCancelled(InvoiceCancelled {
                invoice_hash,
                cancelled_by: caller,
                reason,
            })));

            true
        }

        fn verify_invoice_claim(ref self: ContractState, invoice_hash: felt252, proof: Array<felt252>, public_inputs: Array<felt252>) -> bool {
            let mut invoice = self.invoices.entry(invoice_hash).read();
            assert(invoice.invoice_hash == invoice_hash, MoritaInvoiceErrors::INVOICE_NOT_FOUND);

            // FIXED Issue 1: Match honk_verifier interface dengan single Span<felt252> parameter
            let verifier = IVerifierDispatcher { contract_address: self.verifier_contract.read() };
            
            // Gabungkan proof dan public_inputs menjadi single array sesuai honk_verifier interface
            let mut merged: Array<felt252> = core::array::ArrayTrait::new();
            
            // Append proof elements
            let mut proof_clone = proof.clone();
            let mut proof_span = proof_clone.span();
            loop {
                if proof_span.len() == 0 {
                    break;
                }
                merged.append(*proof_span.pop_front().unwrap());
            };
            
            // Append public_inputs elements
            let mut pi_clone = public_inputs.clone();
            let mut pi_span = pi_clone.span();
            loop {
                if pi_span.len() == 0 {
                    break;
                }
                merged.append(*pi_span.pop_front().unwrap());
            };
            
            let result = verifier.verify_ultra_starknet_honk_proof(merged.span());
            assert(result.is_some(), MoritaInvoiceErrors::PROOF_INVALID);

            invoice.is_verified = true;
            self.invoices.entry(invoice_hash).write(invoice);

            self.emit(Event::MoritaInvoiceEvent(MoritaInvoiceEvent::InvoiceVerified(InvoiceVerified {
                invoice_hash,
                verifier: get_caller_address(),
                verified_at: get_block_timestamp(),
            })));
            
            true
        }
    }
}