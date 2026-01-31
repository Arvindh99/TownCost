import { useMemo } from 'react';
import { useLocations, useLocationById } from '@/hooks/useLocations';
import {
  formatAmount,
  formatCurrencySimple,
  getDefaultCurrency,
  Currency,
} from '@/lib/currencies';

/**
 * Hook to get all unique currencies from locations table
 */
export function useCurrencies() {
  const { data: locations, isLoading } = useLocations();

  const currencies = useMemo(() => {
    if (!locations) return [];

    // Get unique currencies from locations
    const currencyMap = new Map<string, Currency>();
    locations.forEach((loc) => {
      if (!currencyMap.has(loc.currency)) {
        currencyMap.set(loc.currency, {
          id: loc.currency,
          code: loc.currency,
          name: loc.currency,
          symbol: loc.symbol,
        });
      }
    });

    return Array.from(currencyMap.values()).sort((a, b) =>
      a.code.localeCompare(b.code)
    );
  }, [locations]);

  const getCurrencyByCode = useMemo(() => {
    return (code: string): Currency => {
      return currencies.find((c) => c.code === code) || getDefaultCurrency();
    };
  }, [currencies]);

  const formatCurrency = useMemo(() => {
    return (amount: number, currencyCode: string): string => {
      const currency = getCurrencyByCode(currencyCode);
      return formatAmount(amount, currency);
    };
  }, [getCurrencyByCode]);

  return {
    currencies,
    getCurrencyByCode,
    formatCurrency,
    isLoading,
  };
}

/**
 * Hook to get currency formatting utilities for a specific currency code
 */
export function useCurrency(currencyCode: string) {
  const { currencies, isLoading } = useCurrencies();

  const currency = useMemo(() => {
    return currencies.find((c) => c.code === currencyCode) || null;
  }, [currencies, currencyCode]);

  const format = useMemo(() => {
    return (amount: number): string => {
      if (currency) {
        return formatAmount(amount, currency);
      }
      return formatCurrencySimple(amount, currencyCode);
    };
  }, [currency, currencyCode]);

  const getCurrencySymbol = useMemo(() => {
    return currency?.symbol || currencyCode;
  }, [currency, currencyCode]);

  return {
    currency: currency as Currency | null,
    format,
    symbol: getCurrencySymbol,
    isLoading,
  };
}

/**
 * Hook to get currency from a user's location
 */
export function useCurrencyFromLocation(locationId: string | undefined | null) {
  const { data: location, isLoading: locationLoading } =
    useLocationById(locationId);
  const { currencies, isLoading: currenciesLoading } = useCurrencies();

  const currency = useMemo(() => {
    if (!location) return null;
    return currencies.find((c) => c.code === location.currency) || null;
  }, [location, currencies]);

  return {
    currency,
    symbol: location?.symbol || currency?.symbol || '$',
    code: location?.currency || 'USD',
    isLoading: locationLoading || currenciesLoading,
  };
}
