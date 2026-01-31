import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { Loader2, MapPin } from 'lucide-react';
import { LocationSelect } from '@/components/ui/location-select';
import {
  useCountries,
  useStates,
  useCities,
  useLocationByAddress,
} from '@/hooks/useLocations';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  city: z.string().min(2, 'City is required').max(100),
  household_size: z.coerce.number().min(1).max(20).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSetupForm() {
  const { createProfile, createUser } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      country: '',
      state: '',
      city: '',
      household_size: 1,
    },
  });

  const watchCountry = form.watch('country');
  const watchState = form.watch('state');
  const watchCity = form.watch('city');

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(
    watchCountry || undefined
  );
  const { data: cities, isLoading: citiesLoading } = useCities(
    watchCountry || undefined,
    watchState || undefined
  );
  const { data: selectedLocation } = useLocationByAddress(
    watchCountry,
    watchState,
    watchCity
  );

  const handleCountryChange = (value: string) => {
    form.setValue('country', value);
    form.setValue('state', '');
    form.setValue('city', '');
  };

  const handleStateChange = (value: string) => {
    form.setValue('state', value);
    form.setValue('city', '');
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!selectedLocation) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create profile with name
      await createProfile.mutateAsync({
        name: data.name,
      });

      // Create user with location and household size
      await createUser.mutateAsync({
        location_id: selectedLocation.id,
        household_size: data.household_size,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg animate-scale-in shadow-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-display">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Tell us about yourself and where you live to get personalized
            cost-of-living insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your UserName</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <LocationSelect
                        value={field.value}
                        onValueChange={handleCountryChange}
                        placeholder="Select country"
                        options={countries || []}
                        isLoading={countriesLoading}
                        emptyMessage="No countries available"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <LocationSelect
                        value={field.value}
                        onValueChange={handleStateChange}
                        placeholder="Select state"
                        options={states || []}
                        isLoading={statesLoading}
                        disabled={!watchCountry}
                        emptyMessage={
                          watchCountry
                            ? 'No states available'
                            : 'Select a country first'
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <LocationSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Select city"
                        options={cities || []}
                        isLoading={citiesLoading}
                        disabled={!watchState}
                        emptyMessage={
                          watchState
                            ? 'No cities available'
                            : 'Select a state first'
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      This helps us provide localized insights
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="household_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Household Size (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Number of people in your household
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !selectedLocation}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
