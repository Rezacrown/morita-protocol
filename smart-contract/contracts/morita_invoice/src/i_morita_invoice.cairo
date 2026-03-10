use starknet::ContractAddress;
use super::structs::{Invoice, InvoiceStatus};

#[starknet::interface]
pub trait IERC20<TContractState> {
    fn transfer_from(ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256) -> bool;
}

#[starknet::interface]
pub trait IVerifier<TContractState> {
    // Sesuai standar output dari Garaga untuk Honk Proof
    fn verify_ultra_starknet_honk_proof(self: @TContractState, full_proof_with_hints: Span<felt252>) -> Option<Span<u256>>;
}

#[starknet::interface]
pub trait IMoritaInvoice<TContractState> {
    fn create_invoice(
        ref self: TContractState,
        invoice_hash: felt252,
        amount_commitment: felt252,
        payee: ContractAddress,
        client_wallet: ContractAddress,
        amount: u256,
        due_date: u64,
        encrypted_payload: ByteArray
    );
    fn get_invoice_status(self: @TContractState, invoice_hash: felt252) -> InvoiceStatus;
    fn get_invoice(self: @TContractState, invoice_hash: felt252) -> Invoice;
    fn pay_invoice(ref self: TContractState, invoice_hash: felt252, payment_proof: Array<felt252>) -> bool;
    fn cancel_invoice(ref self: TContractState, invoice_hash: felt252, reason: felt252) -> bool;
}