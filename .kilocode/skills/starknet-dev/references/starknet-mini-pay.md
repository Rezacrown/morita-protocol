# Starknet Mini-Pay

Simple P2P payments di Starknet. Generate QR codes, payment links, invoices, dan transfer ETH/STRK/USDC. Seperti Lightning, tapi native.

## Prerequisites

```bash
pip install starknet-py qrcode[pil] python-telegram-bot
```

## Features

- **QR Code Payments**: Generate QR untuk menerima pembayaran
- **Payment Links**: Kirim link pembayaran via Telegram/email
- **Invoices**: Create dan manage invoices
- **Multi-token**: Support ETH, STRK, USDC

## Usage

### Transfer

```python
from starknet_py.net import AccountClient
from starknet_py.contract import Contract

# Transfer ETH
token_contract = Contract(
    abi=erc20_abi,
    address=eth_address,
    client=account
)

await token_contract.functions["transfer"].invoke(
    recipient=recipient_address,
    amount=amount,
    max_fee=MAX_FEE
)
```

### Generate QR

```python
import qrcode

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(f"starknet:{recipient_address}?amount={amount}")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("payment_qr.png")
```

## Referensi

- [starknet-py Documentation](https://starknetpy.readthedocs.io/)
- [Starknet Payments](https://docs.starknet.io/)
