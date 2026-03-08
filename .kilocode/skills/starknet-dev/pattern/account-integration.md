# Template Integrasi Account dan Wallet

Template ini menyediakan pattern-pattern untuk integrasi dengan account abstraction Starknet termasuk session keys dan multi-call patterns.

## 1. Account Abstraction Patterns

### Kontrak yang Mendukung Account Interface

```cairo
#[starknet::contract]
mod my_dapp {
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        authorized_users: LegacyMap<ContractAddress, bool>,
    }

    // Cek apakah caller adalah valid account
    fn is_valid_account(self: @ContractState, account: ContractAddress) -> bool {
        self.authorized_users.read(account)
    }

    #[external(v0)]
    fn require_authorized(ref self: ContractState) {
        let caller = get_caller_address();
        assert(self.authorized_users.read(caller), 'Not authorized');
    }

    #[external(v0)]
    fn authorize(ref self: ContractState, account: ContractAddress) {
        // Tambahkan logika authorization di sini
        self.authorized_users.write(account, true);
    }
}
```

## 2. Session Keys Pattern

Session keys memungkinkan user mendelegasikan kemampuan terbatas ke aplikasi tanpa memberikan full access ke wallet mereka.

### Kontrak Session Manager

```cairo
#[starknet::contract]
mod session_manager {
    use starknet::ContractAddress;
    use starknet::get_block_timestamp;
    use starknet::info::get_caller_address;
    use starknet::account::Call;
    use starknet::secp256_trait::Signature;
    use starknet::secp256r1::Secp256r1Point;
    use utils::ecdsa_secp256r1::check_ecdsa_signature;

    #[storage]
    struct Storage {
        session_keys: LegacyMap<felt252, SessionKey>,
        nonce: u256,
    }

    #[derive(Drop, Serde, starknet::Store)]
    struct SessionKey {
        user: ContractAddress,
        expires_at: u64,
        max_calls: u32,
        calls_made: u32,
        is_active: bool,
    }

    // Membuat session key baru
    #[external(v0)]
    fn create_session(
        ref self: Storage,
        session_pubkey_x: felt252,
        session_pubkey_y: felt252,
        duration_seconds: u64
    ) -> felt252 {
        let caller = get_caller_address();
        let expires_at = get_block_timestamp() + duration_seconds;

        // Generate session ID (biasanya hash dari public key)
        let session_id = poseidon::poseidon_hash([
            caller.into(),
            session_pubkey_x,
            session_pubkey_y,
            get_block_timestamp().into()
        ]);

        self.session_keys.write(session_id, SessionKey {
            user: caller,
            expires_at,
            max_calls: 100, // Maksimum panggilan
            calls_made: 0,
            is_active: true,
        });

        session_id
    }

    // Eksekusi dengan session key
    #[external(v0)]
    fn execute_with_session(
        ref self: Storage,
        session_id: felt252,
        calls: Array<Call>,
        signature: Array<felt252>
    ) -> Array<Span<felt252>> {
        let session = self.session_keys.read(session_id);

        // Validasi session
        assert(session.is_active, 'Session inactive');
        assert(get_block_timestamp() < session.expires_at, 'Session expired');
        assert(session.calls_made < session.max_calls, 'Max calls reached');

        // Verifikasi signature
        // ... ( implementasi signature verification )

        // Eksekusi calls
        let mut results = array![];
        // ... execute calls

        // Update counter
        self.session_keys.write(session_id, SessionKey {
            calls_made: session.calls_made + 1,
            ..session
        });

        results
    }
}
```

## 3. Multi-Call Patterns

Multi-call memungkinkan eksekusi beberapa function dalam satu transaksi, hemat biaya gas.

### Kontrak dengan Multi-Call Support

```cairo
#[starknet::interface]
trait IMultiCall<T> {
    fn multi_call(ref self: T, calls: Array<Call>) -> Array<Span<felt252>>;
}

#[starknet::contract]
mod multi_call_contract {
    use starknet::account::Call;
    use starknet::execute_call;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        values: LegacyMap<felt252, u256>,
    }

    #[external(v0)]
    fn set_value(ref self: ContractState, key: felt252, value: u256) {
        self.values.write(key, value);
    }

    #[external(v0)]
    fn get_value(self: @ContractState, key: felt252) -> u256 {
        self.values.read(key)
    }

    // Multi-call implementation
    #[external(v0)]
    fn multi_call(ref self: ContractState, calls: Array<Call>) -> Array<Span<felt252>> {
        let mut results = array![];

        let mut i = 0;
        loop {
            if i >= calls.len() {
                break;
            }
            let call = calls.at(i);
            let result = execute_call(call, ref self.Storage);
            results.append(result);
            i += 1;
        };

        results
    }
}
```

## 4. Starknet.js Integration

### Menggunakan Account untuk Transaksi

```typescript
import { RpcProvider, Account, Contract, uint256 } from "starknet";

// Setup provider dan account
const provider = new RpcProvider({
  nodeUrl: "https://api.cartridge.gg/x/starknet/main",
});

const account = new Account(
  provider,
  process.env.ACCOUNT_ADDRESS!,
  process.env.PRIVATE_KEY!,
);

// Multi-call example
const calls = [
  {
    contractAddress: tokenAddress,
    entrypoint: "transfer",
    calldata: [recipientAddress, uint256(1000).low, uint256(1000).high],
  },
  {
    contractAddress: contractAddress,
    entrypoint: "update_state",
    calldata: [newValue],
  },
];

// Execute multi-call
const { transaction_hash } = await account.execute(calls);
await provider.waitForTransaction(transaction_hash);
```

### Session Key Integration (Browser)

```typescript
// Di sisi client - generate session key pair
const sessionKeyPair = ec.genKeyPair();
const sessionPublicKey = sessionKeyPair.getPublic("hex");

// Request session dari backend
const response = await fetch("/api/create-session", {
  method: "POST",
  body: JSON.stringify({ sessionPublicKey }),
});

const { sessionId } = await response.json();

// Buat transaction dengan session
const signedInvocation = account.makeInvocation(
  [
    {
      entrypoint: "execute_with_session",
      calldata: [
        sessionId,
        ...calls,
        // signature dari session private key
      ],
    },
  ],
  sessionKeyPair,
);
```

## 5. Best Practices

1. **Validasi yang ketat** - Selalu verifikasi account sebelum eksekusi
2. **Batas session** - Batasi durasi dan jumlah panggilan session key
3. **Fee estimation** - Hitung fee sebelum eksekusi multi-call
4. **Error handling** - Tangani partial failure dalam multi-call
5. **User experience** - Provide feedback saat transaction submitted

## 6. Common Wallet Types

| Wallet            | Class Hash | Description                     |
| ----------------- | ---------- | ------------------------------- |
| Argent X          | `0x...`    | Popular multi-sig wallet        |
| Braavos           | `0x...`    | Hardware wallet integration     |
| Argent Web Wallet | `0x...`    | Browser-based wallet            |
| Custom Account    | Custom     | Your own account implementation |
