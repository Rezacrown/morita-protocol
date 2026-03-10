use starknet::ContractAddress;
use super::structs::{Invoice, InvoiceStatus};

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
}

#[starknet::interface]
pub trait IVerifier<TContractState> {
    // Match honk_verifier.cairo interface: verify_ultra_starknet_honk_proof(self, full_proof_with_hints: Span<felt252>) -> Option<Span<u256>>
    fn verify_ultra_starknet_honk_proof(self: @TContractState, full_proof_with_hints: Span<felt252>) -> Option<Span<u256>>;
}

#[starknet::interface]
pub trait IMoritaInvoice<TContractState> {
    fn create_invoice(
        ref self: TContractState,
        invoice_hash: felt252,
        payee: ContractAddress,
        client_wallet: ContractAddress,
        amount: u256,
        due_date: u64
    );
    fn get_invoice_status(self: @TContractState, invoice_hash: felt252) -> InvoiceStatus;
    fn get_invoice(self: @TContractState, invoice_hash: felt252) -> Invoice;
    
    // Update signature sesuai ZK requirements
    fn pay_invoice(ref self: TContractState, invoice_hash: felt252, payment_proof: Array<felt252>) -> bool;
    fn cancel_invoice(ref self: TContractState, invoice_hash: felt252, reason: felt252) -> bool;
    fn verify_invoice_claim(ref self: TContractState, invoice_hash: felt252, proof: Array<felt252>, public_inputs: Array<felt252>) -> bool;
}