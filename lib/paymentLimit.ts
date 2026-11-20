/**
 * The online-payment rule, kept free of server imports so the /purchase list
 * (a client component) can decide between "Buy Now" and "Request Quote" with
 * the same rule the server enforces.
 */

/** Totals of 20 lakh and above are settled offline; only smaller ones are paid online. */
export const ONLINE_PAYMENT_LIMIT_PAISE = 20_00_000 * 100;

export function canPayOnline(amountPaise: number | null): amountPaise is number {
  return amountPaise != null && amountPaise > 0 && amountPaise < ONLINE_PAYMENT_LIMIT_PAISE;
}
