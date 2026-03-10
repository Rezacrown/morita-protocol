pub mod MoritaInvoiceErrors {
    pub const INVALID_AMOUNT: felt252 = 'INVALID_AMOUNT';
    pub const INVALID_DUE_DATE: felt252 = 'INVALID_DUE_DATE';
    pub const INVOICE_NOT_FOUND: felt252 = 'INVOICE_NOT_FOUND';
    pub const NOT_PENDING: felt252 = 'NOT_PENDING';
    pub const NOT_CANCELLABLE: felt252 = 'NOT_CANCELLABLE';
    pub const NOT_AUTHORIZED: felt252 = 'NOT_AUTHORIZED';
    pub const INVOICE_ALREADY_EXISTS: felt252 = 'INVOICE_ALREADY_EXISTS';
    pub const PROOF_INVALID: felt252 = 'PROOF_INVALID';
    pub const PAYMENT_PROOF_INVALID: felt252 = 'PAYMENT_PROOF_INVALID';
    pub const UNIMPLEMENTED: felt252 = 'UNIMPLEMENTED';
}