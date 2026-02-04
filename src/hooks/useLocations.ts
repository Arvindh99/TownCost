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
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('v_countries').select('*');

      if (error) throw error;

      return data.map((row) => ({ id: row.country, name: row.country }));
    },
  });
}

// Get unique states for a country
export function useStates(country?: string) {
  return useQuery({
    queryKey: ['states', country],
    queryFn: async () => {
      if (!country) return [];
      const { data, error } = await supabase
        .from('v_states')
        .select('state')
        .eq('country', country);

      if (error) throw error;

      return data.map((row) => ({ id: row.state, name: row.state }));
    },
    enabled: !!country,
  });
}

// Get unique cities for a country and state
export function useCities(country?: string, state?: string) {
  return useQuery({
    queryKey: ['cities', country, state],
    queryFn: async () => {
      if (!country || !state) return [];
      const { data, error } = await supabase
        .from('v_cities')
        .select('city')
        .eq('country', country)
        .eq('state', state);

      if (error) throw error;

      return data.map((row) => ({ id: row.city, name: row.city }));
    },
    enabled: !!country && !!state,
  });
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
