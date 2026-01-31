// Pure utility functions for currency formatting
// Currency data is now fetched from the database via useCurrencies hook

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Default fallback currency (used when currency not found)
const DEFAULT_CURRENCY: Currency = {
  code: 'USD',
  name: 'US Dollar',
  symbol: '$',
};

/**
 * Format an amount with a given currency object
 */
export function formatAmount(amount: number, currency: Currency): string {
  return `${currency.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format currency with just the code (used when we don't have the full currency object)
 * Falls back to a simple format if the currency symbol isn't available
 */
export function formatCurrencySimple(
  amount: number,
  currencyCode: string
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch {
    // Fallback if currency code is invalid
    return `${currencyCode} ${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}

/**
 * Get the default currency
 */
export function getDefaultCurrency(): Currency {
  return DEFAULT_CURRENCY;
}
