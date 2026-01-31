import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CategoryAverage {
  category: string;
  month: string;
  user_count: number;
  avg_amount: number | null;
}

interface CostOfLivingIndex {
  month: string;
  user_count: number;
  cost_index: number | null;
}

interface CommunityInsightsData {
  categoryAverages: CategoryAverage[];
  costOfLivingIndex: CostOfLivingIndex[];
  searchLevel: 'city' | 'country';
}

export function useCommunityInsights() {
  const [data, setData] = useState<CommunityInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const searchInsights = async (
    country: string,
    state?: string,
    city?: string
  ) => {
    if (!country.trim()) {
      toast({
        title: 'Country required',
        description: 'Please enter a country to search',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let categoryAverages: CategoryAverage[] = [];
      let costOfLivingIndex: CostOfLivingIndex[] = [];
      let searchLevel: 'city' | 'country' = 'country';

      // For the new schema, we simplify to country-level queries
      // The get_country_averages function works with the new schema
      const [avgResult, colResult] = await Promise.all([
        supabase.rpc('get_country_averages', {
          p_country: country.trim(),
        }),
        supabase.rpc('get_cost_of_living_index', {
          p_country: country.trim(),
        }),
      ]);

      if (avgResult.error) throw avgResult.error;
      if (colResult.error) throw colResult.error;

      categoryAverages = avgResult.data || [];
      costOfLivingIndex = colResult.data || [];
      searchLevel = city ? 'city' : 'country';

      setData({ categoryAverages, costOfLivingIndex, searchLevel });
    } catch (error: any) {
      toast({
        title: 'Error fetching insights',
        description: error.message,
        variant: 'destructive',
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => setData(null);

  return { data, loading, searchInsights, clearResults };
}
