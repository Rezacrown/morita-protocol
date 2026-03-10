use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
pub enum InvoiceStatus {
    Pending,
    Paid,
    Cancelled,
}

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct Invoice {
    pub invoice_hash: felt252,
    pub amount_commitment: felt252, // Ditambahkan untuk kebutuhan ZK Proof
    pub payee: ContractAddress,
    pub client_wallet: ContractAddress,
    pub created_at: u64,
    pub due_date: u64,
    pub amount: u256,
    pub status: InvoiceStatus,
    pub is_verified: bool,
}