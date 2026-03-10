use starknet::ContractAddress;

#[derive(Drop, PartialEq, starknet::Event)]
pub struct InvoiceCreated {
    pub invoice_hash: felt252,
    pub payee: ContractAddress,
    pub client_wallet: ContractAddress,
    pub amount: u256,
    pub created_at: u64,
}

#[derive(Drop, PartialEq, starknet::Event)]
pub struct InvoicePaid {
    pub invoice_hash: felt252,
    pub payer: ContractAddress,
    pub amount: u256,
    pub paid_at: u64,
    pub proof_hash: felt252, // Ditambahkan sesuai requirement MD
}

#[derive(Drop, PartialEq, starknet::Event)]
pub struct InvoiceVerified {
    pub invoice_hash: felt252,
    pub verifier: ContractAddress,
    pub verified_at: u64,
}

#[derive(Drop, PartialEq, starknet::Event)]
pub struct InvoiceCancelled {
    pub invoice_hash: felt252,
    pub cancelled_by: ContractAddress,
    pub reason: felt252,
}

#[derive(Drop, PartialEq, starknet::Event)]
pub enum MoritaInvoiceEvent {
    InvoiceCreated: InvoiceCreated,
    InvoicePaid: InvoicePaid,
    InvoiceVerified: InvoiceVerified,
    InvoiceCancelled: InvoiceCancelled,
}