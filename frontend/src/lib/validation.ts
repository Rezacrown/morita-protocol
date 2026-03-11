/**
 * Validation helpers for Morita Protocol
 * Contains validation functions for form inputs
 */

// Amount in STRK (human readable)
export const MIN_AMOUNT_STRK = 0.001;
export const MAX_AMOUNT_STRK = 1000000;

// Amount in wei (18 decimals for STRK)
const MIN_AMOUNT_WEI = 1000000000000n; // 0.001 STRK
const MAX_AMOUNT_WEI = 1000000000000000000000000n; // 1M STRK

/**
 * Validates if amount is within valid range for ZK circuit
 * @param amountStr - Amount in STRK as string (e.g., "0.001" or "100")
 * @returns boolean
 */
export function validateAmount(amountStr: string): boolean {
  const amount = parseFloat(amountStr);

  // Check if valid number
  if (isNaN(amount) || amount <= 0) {
    return false;
  }

  // Check range in STRK
  if (amount < MIN_AMOUNT_STRK || amount > MAX_AMOUNT_STRK) {
    return false;
  }

  return true;
}

/**
 * Validates Starknet address format
 * @param address - Address string (e.g., "0x1234...")
 * @returns boolean
 */
export function isValidStarknetAddress(address: string): boolean {
  if (!address) {
    return false;
  }

  // Check format: 0x followed by 64 hex characters
  return /^0x[0-9a-fA-F]{64}$/.test(address);
}

/**
 * Gets validation error message for amount
 * @param amountStr - Amount in STRK as string
 * @returns Error message or null if valid
 */
export function getAmountErrorMessage(amountStr: string): string | null {
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    return "Please enter a valid amount greater than 0";
  }

  if (amount < MIN_AMOUNT_STRK) {
    return `Minimum amount is ${MIN_AMOUNT_STRK} STRK`;
  }

  if (amount > MAX_AMOUNT_STRK) {
    return `Maximum amount is ${MAX_AMOUNT_STRK} STRK`;
  }

  return null;
}

/**
 * Gets validation error message for wallet address
 * @param address - Wallet address string
 * @returns Error message or null if valid
 */
export function getWalletAddressErrorMessage(address: string): string | null {
  if (!address || address.trim() === "") {
    return "Wallet address is required";
  }

  if (!isValidStarknetAddress(address)) {
    return "Invalid Starknet address format (must be 64 hex chars starting with 0x)";
  }

  return null;
}

/**
 * Converts amount from STRK to wei (bigint)
 * @param amountStr - Amount in STRK as string
 * @returns Amount in wei as bigint
 */
export function amountToWei(amountStr: string): bigint {
  const amount = parseFloat(amountStr);
  return BigInt(Math.floor(amount * 1_000_000_000_000_000_000));
}
