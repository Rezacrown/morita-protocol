# Template Kontrak Cairo Dasar

Template ini menyediakan struktur dasar untuk membuat kontrak smart contract Cairo menggunakan sintaks modern dengan component-based architecture.

## Struktur Kontrak Dasar

```cairo
#[starknet::contract]
mod my_contract {
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::store;

    // ========== STORAGE ==========
    #[storage]
    struct Storage {
        owner: ContractAddress,
        value: u256,
        mapping: LegacyMap<ContractAddress, u256>,
    }

    // ========== EVENTS ==========
    #[event]
    fn ValueChanged(old_value: u256, new_value: u256) {}

    // ========== CONSTRUCTOR ==========
    #[constructor]
    fn constructor(ref self: ContractState, initial_owner: ContractAddress) {
        self.owner.write(initial_owner);
        self.value.write(0);
    }

    // ========== EXTERNAL FUNCTIONS ==========
    #[external(v0)]
    fn set_value(ref self: ContractState, new_value: u256) {
        let caller = get_caller_address();
        assert(caller == self.owner.read(), 'Only owner can set value');

        let old_value = self.value.read();
        self.value.write(new_value);

        ValueChanged(old_value, new_value);
    }

    #[external(v0)]
    fn get_value(self: @ContractState) -> u256 {
        self.value.read()
    }

    #[external(v0)]
    fn increment(ref self: ContractState, amount: u256) {
        let current = self.value.read();
        self.value.write(current + amount);
    }

    // ========== INTERNAL FUNCTIONS ==========
    fn _authorize_increase(ref self: ContractState) -> bool {
        let caller = get_caller_address();
        caller == self.owner.read()
    }
}
```

## Penjelasan Komponen

### 1. Storage Struct

Bagian `Storage` mendefinisikan semua variabel state kontrak:

- `owner`: Alamat wallet pemilik kontrak
- `value`: Nilai uint256 yang dapat dibaca/ditulis
- `mapping`: Peta (dictionary) dari alamat ke nilai

### 2. Constructor

Fungsi `constructor` dipanggil sekali saat deployment:

- Menerima parameter `initial_owner`
- Menginisialisasi nilai default storage

### 3. External Functions

Fungsi dengan decorator `#[external(v0)]` dapat dipanggil dari luar:

- `set_value`: Hanya owner yang dapat mengubah nilai
- `get_value`: Fungsi view (read-only)
- `increment`: Menaikkan nilai dengan amount tertentu

### 4. Internal Functions

Fungsi internal (tanpa decorator external) hanya dapat dipanggil dari dalam kontrak:

- `_authorize_increase`: Helper untuk authorization check

## Cara Penggunaan

1. **Copy template** ke file baru dengan nama kontrak Anda
2. **Modifikasi Storage** sesuai kebutuhan aplikasi
3. **Tambahkan functions** untuk logika bisnis Anda
4. **Compile** dengan `scarb build`
5. **Deploy** menggunakan tool favorit (sncast, starkli, dll)

## Best Practices

- Selalu gunakan `get_caller_address()` untuk authorization
- Emit events untuk state changes yang penting
- Gunakan assert untuk validasi input
- Pisahkan logic internal dari external interface
