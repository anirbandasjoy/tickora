export function formatCurrency(
  subunitAmount: number,
  currency: string,
  locale = "en",
): string {
  const wholeAmount = subunitAmount / 100;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(wholeAmount);
  } catch {
    return `${currency} ${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(wholeAmount)}`;
  }
} 

/**
 * Convert a whole-unit user input (e.g. 100 BDT) to the subunit integer
 * stored in the DB (e.g. 10000 paisa).
 *
 * @example
 * toSubunit(100) // 10000
 */
export function toSubunit(wholeAmount: number): number {
  return Math.round(wholeAmount * 100);
}

/**
 * Convert a subunit DB value to the whole-unit number for display / form defaults.
 *
 * @example
 * fromSubunit(10000) // 100
 */
export function fromSubunit(subunitAmount: number): number {
  return subunitAmount / 100;
}
