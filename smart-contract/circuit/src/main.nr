use std::hash::pedersen_hash;
// Import fungsi komparasi field
use std::field::bn254::{assert_gt, assert_lt};

/// @title Invoice Commitment Circuit
/// @notice Membuktikan validitas invoice terenkripsi tanpa membocorkan isinya
fn main(
    // === PRIVATE INPUTS (Rahasia, tidak terlihat di on-chain) ===
    client_name_hash: Field,
    description_hash: Field,
    amount: Field,
    encryption_key: [u8; 32],

    // === PUBLIC INPUTS (Terlihat dan dicek di Smart Contract) ===
    // Urutan ini SANGAT PENTING dan harus sama dengan pengecekan di Cairo
    payee_wallet: pub Field,
    client_wallet: pub Field,
    timestamp: pub Field,
    invoice_hash: pub Field,
    amount_commitment: pub Field,
) {
    // 1. Verifikasi Hash Invoice
    // Mengecek apakah hash gabungan data rahasia cocok dengan invoice_hash publik
    let computed_invoice_hash = pedersen_hash([
        client_name_hash,
        description_hash,
        amount,
        payee_wallet,
        client_wallet,
        timestamp,
    ]);
    assert(computed_invoice_hash == invoice_hash);

    // 2. Verifikasi Komitmen Jumlah (Amount Commitment)
    // Mengikat nilai amount dengan byte pertama dari encryption_key
    let computed_amount_commitment = pedersen_hash([
        amount, 
        encryption_key[0] as Field
    ]);
    assert(computed_amount_commitment == amount_commitment);

    // 3. Validasi Rentang Jumlah (Range Check)
    // Min: 0.001 STRK, Max: 1M STRK
    let min_amount: Field = 1000000000000;
    let max_amount: Field = 1000000000000000000000000;
    assert_gt(amount, min_amount);
    assert_lt(amount, max_amount);

    // 4. Validasi Kunci Enkripsi (Mencegah key kosong)
    let mut key_sum: Field = 0;
    for i in 0..32 {
        key_sum = key_sum + (encryption_key[i] as Field);
    }
    assert(key_sum != 0);

    // 5. Validasi Alamat Wallet (Mencegah address 0x0)
    assert(payee_wallet != 0);
    
    // 6. Validasi Keunikan Data
    assert(client_name_hash != description_hash);
}