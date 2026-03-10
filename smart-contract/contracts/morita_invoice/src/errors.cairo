pub mod MoritaInvoiceErrors {
    pub const INVALID_AMOUNT: felt252 = 'Amount must be > 0';
    pub const INVALID_DUE_DATE: felt252 = 'Due date must be in future';
    pub const INVOICE_ALREADY_EXISTS: felt252 = 'Invoice already exists';
    pub const NOT_PENDING: felt252 = 'Invoice is not pending';
    pub const PAYMENT_PROOF_INVALID: felt252 = 'Invalid ZK proof';
    pub const NOT_AUTHORIZED: felt252 = 'Not authorized to cancel';
    pub const NOT_CANCELLABLE: felt252 = 'Invoice cannot be cancelled';
    pub const INVOICE_NOT_FOUND: felt252 = 'Invoice not found';
    
    // ZK Validation Errors
    pub const ZK_PAYEE_MISMATCH: felt252 = 'ZK: Payee mismatch';
    pub const ZK_CLIENT_MISMATCH: felt252 = 'ZK: Client mismatch';
    pub const ZK_TIMESTAMP_MISMATCH: felt252 = 'ZK: Timestamp mismatch';
    pub const ZK_HASH_MISMATCH: felt252 = 'ZK: Hash mismatch';
    pub const ZK_COMMITMENT_MISMATCH: felt252 = 'ZK: Commitment mismatch';
}