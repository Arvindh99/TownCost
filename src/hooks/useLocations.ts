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
  return useQuery({
    queryKey: ['location-by-address', country, state, city],
    enabled: !!country && !!state && !!city,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('country', country!)
        .eq('state', state!)
        .eq('city', city!)
        .single();

      if (error) throw error;
      return data as Location;
    },
  });
}

// Get location by ID
export function useLocationById(locationId: string | undefined | null) {
  return useQuery({
    queryKey: ['location-by-id', locationId],
    enabled: !!locationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId!)
        .single();

      if (error) throw error;
      return data as Location;
    },
  });
}
