import { num } from "starknet";

/**
 * Converts amount from STRK to wei (bigint)
 * @param amountStr - Amount in STRK as string
 * @returns Amount in wei as bigint
 */
export function amountToWei(amountStr: string): bigint {
  const amount = parseFloat(amountStr);
  return BigInt(Math.floor(amount * 1_000_000_000_000_000_000));
}

/**
 * Helper untuk format address agar konsisten
 */
export function formatAddress(addr: string): string {
  return num.toHex(num.toBigInt(addr));
}
