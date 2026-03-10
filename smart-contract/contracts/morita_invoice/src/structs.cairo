use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
#[allow(starknet::store_no_default_variant)]
pub enum InvoiceStatus {
    Pending,
    Paid,
    Cancelled,
    Expired,
}

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct Invoice {
    pub invoice_hash: felt252,
    pub payee: ContractAddress,
    pub client_wallet: ContractAddress,
    pub created_at: u64,
    pub due_date: u64,
    pub amount: u256,
    pub status: InvoiceStatus,
    pub is_verified: bool,
}

#[derive(Copy, Drop, Serde, PartialEq, starknet::Store)]
pub struct PaymentInfo {
    pub invoice_hash: felt252,
    pub payer: ContractAddress,
    pub amount: u256,
    pub paid_at: u64,
}