use starknet::ContractAddress;

#[derive(Drop, starknet::Event)]
pub enum MoritaInvoiceEvent {
    InvoiceCreated: InvoiceCreated,
    InvoicePaid: InvoicePaid,
    InvoiceCancelled: InvoiceCancelled,
}

#[derive(Drop, starknet::Event)]
pub struct InvoiceCreated {
    #[key]
    pub invoice_hash: felt252,
    #[key]
    pub payee: ContractAddress,
    pub client_wallet: ContractAddress,
    pub amount: u256,
    pub amount_commitment: felt252,
    pub created_at: u64,
    // Encrypted payload disave di Event agar hemat storage
    // Frontend bisa fetch event ini dari RPC/Indexer
    pub encrypted_payload: ByteArray, 
}

#[derive(Drop, starknet::Event)]
pub struct InvoicePaid {
    #[key]
    pub invoice_hash: felt252,
    #[key]
    pub payer: ContractAddress,
    pub amount: u256,
    pub paid_at: u64,
}

#[derive(Drop, starknet::Event)]
pub struct InvoiceCancelled {
    #[key]
    pub invoice_hash: felt252,
    pub cancelled_by: ContractAddress,
    pub reason: felt252,
}