import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { LocationSelect } from '@/components/ui/location-select';
import { useCountries, useStates, useCities } from '@/hooks/useLocations';

interface LocationSearchProps {
  onSearch: (country: string, state?: string, city?: string) => void;
  onClear: () => void;
  loading: boolean;
  defaultCountry?: string;
  defaultState?: string;
  defaultCity?: string;
}

export function LocationSearch({
  onSearch,
  onClear,
  loading,
  defaultCountry = '',
  defaultState = '',
  defaultCity = '',
}: LocationSearchProps) {
  const [country, setCountry] = useState(defaultCountry);
  const [state, setState] = useState(defaultState);
  const [city, setCity] = useState(defaultCity);

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(
    country || undefined
  );
  const { data: cities, isLoading: citiesLoading } = useCities(
    country || undefined,
    state || undefined
  );

  // Initialize from defaults when data loads
  useEffect(() => {
    if (defaultCountry) setCountry(defaultCountry);
    if (defaultState) setState(defaultState);
    if (defaultCity) setCity(defaultCity);
  }, [defaultCountry, defaultState, defaultCity]);

  const handleCountryChange = (value: string) => {
    setCountry(value);
    setState('');
    setCity('');
  };

  const handleStateChange = (value: string) => {
    setState(value);
    setCity('');
  };

  const handleSearch = () => {
    onSearch(country, state || undefined, city || undefined);
  };

  const handleClear = () => {
    setCountry(defaultCountry);
    setState(defaultState);
    setCity(defaultCity);
    onClear();
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search Location
        </CardTitle>
        <CardDescription>
          Select a country, state, or city to view community expense insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <LocationSelect
              value={country}
              onValueChange={handleCountryChange}
              placeholder="Select country"
              options={countries || []}
              isLoading={countriesLoading}
              emptyMessage="No countries available"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State (optional)</Label>
            <LocationSelect
              value={state}
              onValueChange={handleStateChange}
              placeholder="Select state"
              options={states || []}
              isLoading={statesLoading}
              disabled={!country}
              emptyMessage={
                country ? 'No states available' : 'Select a country first'
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City (optional)</Label>
            <LocationSelect
              value={city}
              onValueChange={setCity}
              placeholder="Select city"
              options={cities || []}
              isLoading={citiesLoading}
              disabled={!state}
              emptyMessage={
                state ? 'No cities available' : 'Select a state first'
              }
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={handleSearch} disabled={loading || !country}>
            {loading ? 'Searching...' : 'Search'}
          </Button>
          <Button variant="outline" onClick={handleClear} disabled={loading}>
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
