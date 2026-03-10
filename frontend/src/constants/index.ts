// Constants and configuration for the frontend

// Address of the deployed MoritaInvoice contract on Sepolia Testnet
export const MORITA_CONTRACT_ADDRESS =
  "0x031d5920e2af25bb90a259c0fe44e53f89d08428bbed8e4fcea24f6b117765c5";

// Address of STRK Token on Sepolia
export const STRK_TOKEN_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// ABI snippet
export const MORITA_ABI = [
  {
    type: "impl",
    name: "MoritaInvoiceImpl",
    interface_name: "morita_invoice::i_morita_invoice::IMoritaInvoice",
  },
  {
    type: "struct",
    name: "core::integer::u256",
    members: [
      {
        name: "low",
        type: "core::integer::u128",
      },
      {
        name: "high",
        type: "core::integer::u128",
      },
    ],
  },
  {
    type: "struct",
    name: "core::byte_array::ByteArray",
    members: [
      {
        name: "data",
        type: "core::array::Array::<core::bytes_31::bytes31>",
      },
      {
        name: "pending_word",
        type: "core::felt252",
      },
      {
        name: "pending_word_len",
        type: "core::integer::u32",
      },
    ],
  },
  {
    type: "enum",
    name: "morita_invoice::structs::InvoiceStatus",
    variants: [
      {
        name: "Pending",
        type: "()",
      },
      {
        name: "Paid",
        type: "()",
      },
      {
        name: "Cancelled",
        type: "()",
      },
    ],
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      {
        name: "False",
        type: "()",
      },
      {
        name: "True",
        type: "()",
      },
    ],
  },
  {
    type: "struct",
    name: "morita_invoice::structs::Invoice",
    members: [
      {
        name: "invoice_hash",
        type: "core::felt252",
      },
      {
        name: "amount_commitment",
        type: "core::felt252",
      },
      {
        name: "payee",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "client_wallet",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "created_at",
        type: "core::integer::u64",
      },
      {
        name: "due_date",
        type: "core::integer::u64",
      },
      {
        name: "amount",
        type: "core::integer::u256",
      },
      {
        name: "status",
        type: "morita_invoice::structs::InvoiceStatus",
      },
      {
        name: "is_verified",
        type: "core::bool",
      },
    ],
  },
  {
    type: "interface",
    name: "morita_invoice::i_morita_invoice::IMoritaInvoice",
    items: [
      {
        type: "function",
        name: "create_invoice",
        inputs: [
          {
            name: "invoice_hash",
            type: "core::felt252",
          },
          {
            name: "amount_commitment",
            type: "core::felt252",
          },
          {
            name: "payee",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "client_wallet",
            type: "core::starknet::contract_address::ContractAddress",
          },
          {
            name: "amount",
            type: "core::integer::u256",
          },
          {
            name: "due_date",
            type: "core::integer::u64",
          },
          {
            name: "encrypted_payload",
            type: "core::byte_array::ByteArray",
          },
        ],
        outputs: [],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_invoice_status",
        inputs: [
          {
            name: "invoice_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "morita_invoice::structs::InvoiceStatus",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_invoice",
        inputs: [
          {
            name: "invoice_hash",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "morita_invoice::structs::Invoice",
          },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "pay_invoice",
        inputs: [
          {
            name: "invoice_hash",
            type: "core::felt252",
          },
          {
            name: "payment_proof",
            type: "core::array::Array::<core::felt252>",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "cancel_invoice",
        inputs: [
          {
            name: "invoice_hash",
            type: "core::felt252",
          },
          {
            name: "reason",
            type: "core::felt252",
          },
        ],
        outputs: [
          {
            type: "core::bool",
          },
        ],
        state_mutability: "external",
      },
    ],
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      {
        name: "owner",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "fee_collector",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "strk_token",
        type: "core::starknet::contract_address::ContractAddress",
      },
      {
        name: "verifier_contract",
        type: "core::starknet::contract_address::ContractAddress",
      },
    ],
  },
  {
    type: "event",
    name: "morita_invoice::events::InvoiceCreated",
    kind: "struct",
    members: [
      {
        name: "invoice_hash",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "payee",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "client_wallet",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "amount_commitment",
        type: "core::felt252",
        kind: "data",
      },
      {
        name: "created_at",
        type: "core::integer::u64",
        kind: "data",
      },
      {
        name: "encrypted_payload",
        type: "core::byte_array::ByteArray",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "morita_invoice::events::InvoicePaid",
    kind: "struct",
    members: [
      {
        name: "invoice_hash",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "payer",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "key",
      },
      {
        name: "amount",
        type: "core::integer::u256",
        kind: "data",
      },
      {
        name: "paid_at",
        type: "core::integer::u64",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "morita_invoice::events::InvoiceCancelled",
    kind: "struct",
    members: [
      {
        name: "invoice_hash",
        type: "core::felt252",
        kind: "key",
      },
      {
        name: "cancelled_by",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "reason",
        type: "core::felt252",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "morita_invoice::events::MoritaInvoiceEvent",
    kind: "enum",
    variants: [
      {
        name: "InvoiceCreated",
        type: "morita_invoice::events::InvoiceCreated",
        kind: "nested",
      },
      {
        name: "InvoicePaid",
        type: "morita_invoice::events::InvoicePaid",
        kind: "nested",
      },
      {
        name: "InvoiceCancelled",
        type: "morita_invoice::events::InvoiceCancelled",
        kind: "nested",
      },
    ],
  },
  {
    type: "event",
    name: "morita_invoice::morita_invoice::MoritaInvoice::Event",
    kind: "enum",
    variants: [
      {
        name: "MoritaInvoiceEvent",
        type: "morita_invoice::events::MoritaInvoiceEvent",
        kind: "nested",
      },
    ],
  },
] as const;
