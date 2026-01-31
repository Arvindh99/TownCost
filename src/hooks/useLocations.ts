import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Location } from '@/types/database';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('country')
        .order('state')
        .order('city');

      if (error) throw error;
      return data as Location[];
    },
  });
}

// Get unique countries from locations
export function useCountries() {
  const { data: locations, isLoading, error } = useLocations();

  const countries = locations
    ? [...new Set(locations.map((l) => l.country))].map((country) => ({
        id: country,
        name: country,
      }))
    : [];

  return { data: countries, isLoading, error };
}

// Get unique states for a country
export function useStates(country: string | undefined) {
  const { data: locations, isLoading, error } = useLocations();

  const states =
    locations && country
      ? [
          ...new Set(
            locations.filter((l) => l.country === country).map((l) => l.state)
          ),
        ].map((state) => ({
          id: state,
          name: state,
        }))
      : [];

  return {
    data: states,
    isLoading: isLoading && !!country,
    error,
  };
}

// Get unique cities for a country and state
export function useCities(
  country: string | undefined,
  state: string | undefined
) {
  const { data: locations, isLoading, error } = useLocations();

  const cities =
    locations && country && state
      ? [
          ...new Set(
            locations
              .filter((l) => l.country === country && l.state === state)
              .map((l) => l.city)
          ),
        ].map((city) => ({
          id: city,
          name: city,
        }))
      : [];

  return {
    data: cities,
    isLoading: isLoading && !!country && !!state,
    error,
  };
}

// Get full location record by country, state, city
export function useLocationByAddress(
  country: string | undefined,
  state: string | undefined,
  city: string | undefined
) {
  const { data: locations, isLoading, error } = useLocations();

  const location =
    locations && country && state && city
      ? locations.find(
          (l) => l.country === country && l.state === state && l.city === city
        ) || null
      : null;

  return {
    data: location,
    isLoading: isLoading && !!country && !!state && !!city,
    error,
  };
}

// Get location by ID
export function useLocationById(locationId: string | undefined | null) {
  const { data: locations, isLoading, error } = useLocations();

  const location =
    locations && locationId
      ? locations.find((l) => l.id === locationId) || null
      : null;

  return {
    data: location,
    isLoading: isLoading && !!locationId,
    error,
  };
}
