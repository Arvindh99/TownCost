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
  currencySymbol: string; // <-- added
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
      let currencySymbol = '₹'; // default fallback

      // Fetch averages, cost-of-living, and country currency in parallel
      const [avgResult, colResult, currencyResult] = await Promise.all([
        supabase.rpc('get_country_averages', { p_country: country.trim() }),
        supabase.rpc('get_cost_of_living_index', { p_country: country.trim() }),
        supabase
          .from('locations')
          .select('symbol')
          .eq('country', country.trim())
          .limit(1)
          .single(),
      ]);

      if (avgResult.error) throw avgResult.error;
      if (colResult.error) throw colResult.error;
      if (currencyResult.error) throw currencyResult.error;

      categoryAverages = avgResult.data || [];
      costOfLivingIndex = colResult.data || [];
      searchLevel = city ? 'city' : 'country';
      currencySymbol = currencyResult.data?.symbol || '₹';

      setData({
        categoryAverages,
        costOfLivingIndex,
        searchLevel,
        currencySymbol,
      });
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
