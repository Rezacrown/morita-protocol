// Import hash functions from Noir stdlib
use std::hash::pedersen_hash;

// Import field comparison functions
use std::field::bn254::{assert_gt, assert_lt};

/// @title Invoice Commitment Circuit
/// @notice Proves knowledge of encrypted invoice data without revealing contents
/// @dev Uses pedersen hash for commitment, compatible with Starknet Honk verifier
/// @dev This circuit verifies that:
///      1. The encrypted invoice data matches the on-chain commitment hash
///      2. The amount is within valid range (0.001 - 1M STRK)
///      3. The encryption key is valid (not zero)
///      4. Timestamps are within reasonable bounds
/// 
/// Usage:
/// - Private inputs: client_name_hash, description_hash, amount, encryption_key
/// - Public inputs: payee_wallet, client_wallet, timestamp, invoice_hash, amount_commitment
fn main(
    // PRIVATE INPUTS (secret, not revealed in proof)
    client_name_hash: Field,
    description_hash: Field,
    amount: Field,
    encryption_key: [u8; 32],

    // PUBLIC INPUTS (visible on-chain)
    payee_wallet: pub Field,
    client_wallet: pub Field,
    timestamp: pub Field,
    invoice_hash: pub Field,
    amount_commitment: pub Field,
) {
    // ============================================
    // CONSTRAINT 1: Invoice Hash Match
    // ============================================
    // Compute the expected invoice hash from private inputs
    // Using pedersen hash: H(client_name_hash, description_hash, amount, payee, client, timestamp)
    let computed_invoice_hash = pedersen_hash([
        client_name_hash,
        description_hash,
        amount,
        payee_wallet,
        client_wallet,
        timestamp,
    ]);
    
    // Assert that computed hash matches the public invoice_hash
    assert(computed_invoice_hash == invoice_hash);

    // ============================================
    // CONSTRAINT 2: Amount Commitment Match
    // ============================================
    // Create commitment for amount using pedersen with encryption key first byte
    // This binds the amount to the encryption key
    let computed_amount_commitment = pedersen_hash([
        amount, 
        encryption_key[0] as Field
    ]);

    // Assert amount commitment is valid
    assert(computed_amount_commitment == amount_commitment);

    // ============================================
    // CONSTRAINT 3: Amount Range Validation
    // ============================================
    // Minimum amount: 0.001 STRK = 10^12 wei
    let min_amount: Field = 1000000000000;
    
    // Maximum amount: 1M STRK
    let max_amount: Field = 1000000000000000000000000;

    // Assert amount is within valid range using assert_gt and assert_lt
    assert_gt(amount, min_amount);
    assert_lt(amount, max_amount);

    // ============================================
    // CONSTRAINT 4: Encryption Key Validation
    // ============================================
    // Verify encryption key is not zero (must be valid 32-byte key)
    // Sum all key bytes - must be > 0
    let mut key_sum: Field = 0;
    for i in 0..32 {
        key_sum = key_sum + (encryption_key[i] as Field);
    }
    assert(key_sum != 0);

    // ============================================
    // CONSTRAINT 5: Timestamp Validation
    // ============================================
    // Minimum timestamp: January 1, 2024 (1704067200)
    let min_timestamp: Field = 1704067200;
    
    // Maximum timestamp: January 1, 2030 (1893456000)
    let max_timestamp: Field = 1893456000;

    // Assert timestamp is within valid range
    assert_gt(timestamp, min_timestamp);
    assert_lt(timestamp, max_timestamp);

    // ============================================
    // CONSTRAINT 6: Wallet Address Validation
    // ============================================
    // Verify payee wallet is not zero address
    assert(payee_wallet != 0);
    
    // Verify client wallet is not zero address  
    assert(client_wallet != 0);

    // ============================================
    // CONSTRAINT 7: Hash Uniqueness
    // ============================================
    // Ensure client_name_hash and description_hash are different
    // This prevents accidental duplicate or empty data
    assert(client_name_hash != description_hash);




     // ====== Compute invoice hash ======== (commnet later)
    // let invoice_hash = std::hash::pedersen_hash([
    //     client_name_hash,
    //     description_hash,
    //     amount,
    //     payee_wallet,
    //     client_wallet,
    //     timestamp,
    // ]);
    
    // // Compute amount commitment
    // let amount_commitment = std::hash::pedersen_hash([
    //     amount, 
    //     encryption_key[0] as Field
    // ]);

    // // Output computed values 
    // println("=========================================");
    // println("UPDATE Prover.toml WITH THESE VALUES:");
    // println("=========================================");
    // println("");
    // println(f"invoice_hash = \"{invoice_hash}\"");
    // println(f"amount_commitment = \"{amount_commitment}\"");
    // println("");
    // println("Full inputs reference:");
    // println(f"client_name_hash = {client_name_hash}");
    // println(f"description_hash = {description_hash}");
    // println(f"amount = {amount}");
    // println(f"payee_wallet = {payee_wallet}" );
    // println(f"client_wallet = {client_wallet}" );
    // println(f"timestamp = {timestamp}" );
    // println(f"encryption_key[0] = {{encryption_key[0] as Field}}");
    // println("=========================================");
}
