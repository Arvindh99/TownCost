import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm';
import { Card, CardContent } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import { Loader2, Lock, MapPin } from 'lucide-react';
import { LocationSearch } from '@/components/insights/LocationSearch';
import { InsightsResults } from '@/components/insights/InsightsResults';
import { useCommunityInsights } from '@/hooks/useCommunityInsights';
import { useLocationById } from '@/hooks/useLocations';
import { useCurrencyFromLocation } from '@/hooks/useCurrency';

export default function Insights() {
  const { authUser, userData, loading } = useAuth();
  const { data: location } = useLocationById(userData?.location_id);
  const {
    data,
    loading: searchLoading,
    searchInsights,
    clearResults,
  } = useCommunityInsights();
  const [searchLocation, setSearchLocation] = useState('');
  const userLocationId = userData?.location_id;
  const { symbol } = useCurrencyFromLocation(userLocationId);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!authUser) return <Navigate to="/auth" replace />;
  if (!userData) return <ProfileSetupForm />;

  const handleSearch = (country: string, state?: string, city?: string) => {
    const locationParts = [city, state, country].filter(Boolean);
    setSearchLocation(locationParts.join(', '));
    searchInsights(country, state, city);
  };

  const handleClear = () => {
    setSearchLocation('');
    clearResults();
  };

  const locationDisplay = location
    ? `${location.city}, ${location.state}, ${location.country}`
    : 'Not set';

  return (
    <Layout>
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Community Insights
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore expense insights for any location
          </p>
        </div>

        {/* Your Location Card */}
        <Card className="shadow-card">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your Location</p>
              <p className="text-sm text-muted-foreground">{locationDisplay}</p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="border border-primary/20 shadow-sm">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Privacy Protected
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                All data is anonymized and aggregated.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <LocationSearch
          onSearch={handleSearch}
          onClear={handleClear}
          loading={searchLoading}
          defaultCountry={location?.country}
          defaultState={location?.state}
          defaultCity={location?.city}
        />

        {/* Results */}
        {data && (
          <InsightsResults
            categoryAverages={data.categoryAverages}
            costOfLivingIndex={data.costOfLivingIndex}
            searchLevel={data.searchLevel}
            searchLocation={searchLocation}
            currencySymbol={symbol}
          />
        )}
      </div>
    </Layout>
  );
}
