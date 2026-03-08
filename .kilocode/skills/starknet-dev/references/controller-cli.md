# Controller CLI

Install dan operasikan Cartridge Controller CLI (`controller`) untuk membuat human-approved sessions dan execute Starknet transactions.

## Prerequisites

```bash
npm install @cartridge/controller
```

## Features

- **Session Keys**: Create sessions dengan policies
- **JSON-only**: Explicit network selection
- **Least-privilege**: Policy scoping
- **Paymaster Control**: Gasless transactions
- **Error Recovery**: Built-in retry logic

## Usage

```bash
# Create session
controller session create \
  --policy "approve:0xCONTRACT:*" \
  --policy "transfer:0xTOKEN:1000" \
  --expiry 3600

# Execute transaction
controller invoke \
  --session SESSION_ID \
  --contract 0xCONTRACT \
  --function transfer \
  --calldata 0xRECIPIENT 1000
```

## Session Policies

```json
{
  "policies": [
    {
      "target": "0xTOKEN_ADDRESS",
      "method": "transfer",
      "constraints": {
        "max_amount": "1000000000000000000"
      }
    }
  ]
}
```

## Referensi

- [Cartridge Controller Documentation](https://docs.cartridge.gg/controller/)
- [Starknet Sessions](https://www.starknet.io/blog/session-keys/)
